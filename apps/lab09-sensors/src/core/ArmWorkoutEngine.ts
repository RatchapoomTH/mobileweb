import type { AccelSample, WorkoutState } from "./types";
import { TtsService } from "./TtsService";
import { HapticsService } from "./HapticsService";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastRepTime = 0;
  private phase: "WAIT_START" | "WAIT_UP" = "WAIT_START";

  private tts = new TtsService();
  private haptics = new HapticsService();

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0,
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  private emit() { this.listeners.forEach((cb) => cb(this.clone())); }
  private clone(): WorkoutState { return JSON.parse(JSON.stringify(this.state)); }

  async start() {
    this.state.status = "RUNNING";
    this.state.repDisplay = 0;
    this.state.stats = { repsTotal: 0, repsOk: 0, repsBad: 0, score: 0, avgRepMs: 0 };
    this.phase = "WAIT_START";
    this.lastRepTime = Date.now();
    this.emit();
    await this.tts.speak("ถือโทรศัพท์แนวนอน หันหัวไปด้านหน้า แล้วค่อยๆ พลิกขึ้นชี้ฟ้า");
  }

  stop() {
    this.state.status = "STOPPED";
    this.tts.speak("หยุดการทำงาน");
    this.emit();
  }

  async process(sample: AccelSample) {
  if (this.state.status !== "RUNNING") return;

  const y = sample.ay; // แกนชี้ฟ้า (แนวตั้ง)
  const z = sample.az; // แกนชี้หน้า (แนวนอน)

  const START_Z_TH = 8.5
  const END_Y_TH = 8.5;
  const MIN_MS = 800;

  if (this.phase === "WAIT_START") {
    // จังหวะเตรียม: โทรศัพท์ต้องขนานพื้น หันหัวไปข้างหน้า (Z เด่น)
    if (z > START_Z_TH) {
      this.phase = "WAIT_UP"; // ล็อคเป้าหมายถัดไปคือต้องยกขึ้น
      this.state.stats.lastMessage = "ยกขึ้นได้เลย...";
      this.emit();
    }
  } else if (this.phase === "WAIT_UP") {
    // จังหวะยก: โทรศัพท์ต้องพลิกจนตั้งฉาก (Y เด่น)
    if (y > END_Y_TH) {
      const now = Date.now();
      const repMs = now - this.lastRepTime;

      // เช็คว่าไม่ใช่การสั่น
      if (repMs > MIN_MS) {
        // นับสำเร็จ!
        this.state.repDisplay++;
        this.state.stats.repsOk++;
        this.state.stats.score++;
        this.state.stats.lastMessage = "เยี่ยม!";
        this.state.stats.avgRepMs = Math.round((this.state.stats.avgRepMs + repMs) / 2);
        
        this.lastRepTime = now;
        this.phase = "WAIT_START"; // บังคับให้ต้องกลับไปท่าเริ่มต้น (Z) ก่อนถึงจะนับใหม่ได้
        
        await this.haptics.success();
        await this.tts.speak(`${this.state.repDisplay}`);
        this.emit();
      }
    }
  }
  }
}