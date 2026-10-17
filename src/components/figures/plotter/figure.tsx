import { Plate } from "@/components/iso/react/draw";
import { PlotterArt } from "./art";
import { GROW, MAX_TERMS, SAMPLES } from "./model";
import "./plotter.css";

export function PlotterFigure({ files, fig = "Fig 3" }: { files: string[]; fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="Icons as sums of circles"
      hint="Drag the knob · click the crank"
      readout={`Frame 1 · N ${GROW[0]} · error — %`}
      keys={[
        { mark: "lit", label: "The pens and what they have drawn" },
        { mark: "raised", label: "Disc towers, one disc per circle" },
        { mark: "flat", label: "The icon printed on the card" },
      ]}
      caption={`A flatbed plotter with ${files.length} cards in its magazine. Each closed contour of an icon is sampled into ${SAMPLES} points, transformed, and redrawn by a tower of spinning discs, the largest circles first. The knob sets N, the number of circles per tower, up to ${MAX_TERMS}; left alone it steps through ${GROW.join(", ")} and then feeds the next card. The dial reads the largest gap between the drawing and the printed icon as a percentage of its height.`}
    >
      <PlotterArt files={files} />
    </Plate>
  );
}
