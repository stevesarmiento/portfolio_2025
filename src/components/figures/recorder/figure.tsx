import { Plate } from "@/components/iso/react/draw";
import { RecorderArt } from "./art";
import { PRESETS, readoutOf } from "./model";
import "./recorder.css";

export function RecorderFigure({ fig = "Fig 2" }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="Harmonic recorder"
      hint="Turn the selector · drag the terms knob"
      readout={readoutOf(PRESETS[0], PRESETS[0].terms.length, 0)}
      keys={[
        { mark: "lit", label: "The pen and what it has written" },
        { mark: "raised", label: "Disc tower, one disc per sine term" },
        { mark: "edge", label: "Link rod from the tower's tip to the pen carriage" },
      ]}
      caption={`A chart recorder driven by a stack of spinning discs. Each disc is one term a·sin(f·x + p): its radius is a and it turns f times per unit of x. The pen can only move across the paper, so it writes the sum. Six series: ${PRESETS.map((p) => `${p.name} (${p.formula})`).join("; ")}.`}
    >
      <RecorderArt />
    </Plate>
  );
}
