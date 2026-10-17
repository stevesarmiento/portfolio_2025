import * as React from "react";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { BASE_ART, BED_ART, COUNTER_ART, CRANK_ART, DIAL_ART, LABEL_ART, MAG_ART, N_KNOB_ART, RULER_ART, TOGGLE_AUTO_ART, TOGGLE_RUN_ART, TRAY_ART } from "./geometry";
import { PlotterLive } from "./live";

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      <g key={index}>
        {parts.map((paths, part) => (
          <Solid key={part} paths={paths} tone={part ? "mid" : "lo"} crease="faint" />
        ))}
      </g>
    ))}
    <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <Solid paths={LABEL_ART.plate} tone="lo" crease="none" />
    <Line d={LABEL_ART.line} tone="faint" />
    <Line d={LABEL_ART.rule} tone="lo" free />
    <Dots points={LABEL_ART.screws} size={0.45} tone="mid" />
    <Solid paths={RULER_ART.strip} tone="lo" crease="none" />
    <Line d={RULER_ART.minor} tone="lo" />
    <Line d={RULER_ART.major} tone="mid" />
    <Dots points={RULER_ART.ends} size={0.45} tone="mid" />
    <Line d={BED_ART.recess} tone="faint" />
  </g>
);

const MAGAZINE = (
  <g key="magazine">
    <Solid paths={MAG_ART.tray} tone="mid" crease="faint" />
    <Line d={MAG_ART.slot} tone="lo" />
    <Solid paths={MAG_ART.fenceBack} tone="mid" crease="faint" />
    <Solid paths={MAG_ART.fenceSide} tone="mid" crease="faint" />
    <Dots points={MAG_ART.fenceScrews} size={0.45} tone="mid" />
    <Solid paths={MAG_ART.stack} tone="hi" crease="lo" inner={<Line d={MAG_ART.stackSeams} tone="faint" />} />
    <Solid paths={MAG_ART.leverPost} tone="mid" crease="none" />
    <Solid paths={MAG_ART.leverKnob} tone="mid" crease="faint" />
    <Line d={MAG_ART.leverKnurl} tone="lo" />
    <Line d={MAG_ART.leverHub} tone="lo" />
  </g>
);

const TRAY = (
  <g key="tray">
    <Solid paths={TRAY_ART.floor} tone="mid" crease="faint" />
    <Solid paths={TRAY_ART.back} tone="mid" crease="faint" />
    <Solid paths={TRAY_ART.left} tone="mid" crease="faint" />
    <Dots points={TRAY_ART.screws} size={0.45} tone="mid" />
    <Solid paths={TRAY_ART.cards} tone="hi" crease="lo" inner={<Line d={TRAY_ART.cardSeam} tone="faint" />} />
    <Solid paths={TRAY_ART.right} tone="mid" crease="faint" />
    <Solid paths={TRAY_ART.front} tone="mid" crease="faint" />
  </g>
);

const BED = (
  <g key="bed">
    {BED_ART.pins.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Dots points={BED_ART.pinTops} size={0.4} tone="lo" />
  </g>
);

const CARD = (
  <g key="card">
    <Solid paths={BED_ART.card} tone="hi" crease="lo" />
  </g>
);

const CLIPS = (
  <g key="clips">
    {BED_ART.clips.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Dots points={BED_ART.clipScrews} size={0.45} tone="mid" />
  </g>
);

const CONTROLS = (
  <g key="controls">
    <Line d={N_KNOB_ART.rim} tone="faint" />
    <Line d={N_KNOB_ART.minor} tone="lo" />
    <Line d={N_KNOB_ART.major} tone="mid" />
    <Solid paths={N_KNOB_ART.body} tone="mid" crease="faint" />
    <Line d={N_KNOB_ART.knurl} tone="lo" />
    <Line d={N_KNOB_ART.hub} tone="lo" />
    <Solid paths={CRANK_ART.boss} tone="lo" crease="faint" />
    <Dots points={CRANK_ART.bossScrews} size={0.45} tone="mid" />
    <Solid paths={CRANK_ART.hub} tone="mid" crease="faint" />
    <Solid paths={TOGGLE_AUTO_ART.base} tone="mid" crease="faint" />
    <Dots points={TOGGLE_AUTO_ART.screws} size={0.4} tone="mid" />
    <Solid paths={TOGGLE_RUN_ART.base} tone="mid" crease="faint" />
    <Dots points={TOGGLE_RUN_ART.screws} size={0.4} tone="mid" />
    <Solid paths={COUNTER_ART.housing} tone="mid" crease="faint" />
    <Solid paths={COUNTER_ART.window} tone="lo" crease="none" flat />
    <Line d={COUNTER_ART.windowLine} tone="lo" />
    <Dots points={COUNTER_ART.screws} size={0.4} tone="mid" />
  </g>
);

const toggleLever = (parts: typeof TOGGLE_AUTO_ART.on) => parts.map((paths, index) => <Solid key={index} paths={paths} tone="mid" crease="faint" />);

const TOGGLES = {
  autoOn: <g key="auto-on">{toggleLever(TOGGLE_AUTO_ART.on)}</g>,
  autoOff: <g key="auto-off">{toggleLever(TOGGLE_AUTO_ART.off)}</g>,
  runOn: <g key="run-on">{toggleLever(TOGGLE_RUN_ART.on)}</g>,
  runOff: <g key="run-off">{toggleLever(TOGGLE_RUN_ART.off)}</g>,
};

const DIAL = (
  <g key="dial">
    <Solid paths={DIAL_ART.stand} tone="lo" crease="faint" />
    <Dots points={DIAL_ART.standScrews} size={0.45} tone="mid" />
    <Solid paths={DIAL_ART.puck} tone="mid" crease="faint" />
    <Line d={DIAL_ART.band} tone="faint" />
    <Line d={DIAL_ART.seam} tone="faint" />
    <Line d={DIAL_ART.bezel} tone="lo" />
    <Line d={DIAL_ART.face} tone="faint" />
    <Line d={DIAL_ART.minor} tone="lo" />
    <Line d={DIAL_ART.major} tone="mid" />
  </g>
);

const LABEL =
  "A flatbed plotter that redraws icons from spinning circles. A paper card with the icon printed on it lies on the bed, held by two clips. Over each closed contour of the icon stands a tower of discs, one disc per circle of its Fourier series, each disc carrying the pivot of the next. A stylus hangs from the top of each tower and traces the contour on the card as the discs turn. A knob sets how many circles are used, a crank feeds the next card from the magazine, and a dial gauge reads how far the drawing is from the printed icon.";

export function PlotterArt({ files }: { files: string[] }) {
  return (
    <PlotterLive
      files={files}
      label={LABEL}
      base={BASE}
      magazine={MAGAZINE}
      tray={TRAY}
      bed={BED}
      card={CARD}
      clips={CLIPS}
      controls={CONTROLS}
      toggles={TOGGLES}
      dial={DIAL}
      counterMatrix={COUNTER_ART.text}
      dialLabel={DIAL_ART.label}
    />
  );
}
