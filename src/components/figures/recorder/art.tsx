import * as React from "react";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { BASE_ART, BRIDGE_ART, LABEL_ART, PAPER_ART, RULER_ART, RUN_ART, SEL_ART, SPOOL_ART, TERMS_ART, TOWER_ART } from "./geometry";
import { RecorderLive } from "./live";

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
  </g>
);

const MOTOR = (
  <g key="motor">
    <Solid paths={TOWER_ART.motor} tone="mid" crease="faint" />
    <Line d={TOWER_ART.motorVents} tone="lo" />
    <Dots points={TOWER_ART.motorScrews} size={0.45} tone="mid" />
    <Solid paths={TOWER_ART.cap} tone="mid" crease="faint" />
    <Solid paths={TOWER_ART.coupling} tone="mid" crease="faint" />
    <Solid paths={TOWER_ART.pedestal} tone="mid" crease="faint" />
    <Dots points={TOWER_ART.pedestalScrews} size={0.45} tone="mid" />
  </g>
);

const spool = (index: number) => (
  <g key={`spool-${index}`}>
    <Solid paths={SPOOL_ART.bearings[index * 2]} tone="lo" crease="faint" />
    <Solid paths={SPOOL_ART.bearings[index * 2 + 1]} tone="lo" crease="faint" />
    <Solid paths={SPOOL_ART.spools[index]} tone="mid" crease="faint" />
    <Line d={SPOOL_ART.ends[index]} tone="lo" />
    <g className="iso-solid">
      <path className="iso-fill" d={SPOOL_ART.sheets[index]} />
      <path className="iso-top" d={SPOOL_ART.sheets[index]} />
      <path className="iso-line iso-edge" data-tone="mid" d={SPOOL_ART.sheets[index]} />
    </g>
  </g>
);

const PAPER = (
  <g key="paper">
    {spool(0)}
    {PAPER_ART.bearings.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" crease="faint" />
    ))}
    <Dots points={PAPER_ART.bearingScrews} size={0.4} tone="mid" />
    <Solid paths={PAPER_ART.platen} tone="mid" crease="faint" />
    {PAPER_ART.rollers.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Line d={PAPER_ART.rollerEnds} tone="lo" />
    <Solid paths={PAPER_ART.strip} tone="hi" crease="none" />
    <Line d={PAPER_ART.edgeLines} tone="faint" />
    {spool(1)}
  </g>
);

const BRIDGE_BACK = (
  <g key="bridge-back">
    <Solid paths={BRIDGE_ART.postFeet[0]} tone="lo" crease="faint" />
    <Solid paths={BRIDGE_ART.posts[0]} tone="mid" crease="faint" />
  </g>
);

const BRIDGE_FRONT = (
  <g key="bridge-front">
    <Solid paths={BRIDGE_ART.postFeet[1]} tone="lo" crease="faint" />
    <Dots points={BRIDGE_ART.footScrews} size={0.45} tone="mid" />
    <Solid paths={BRIDGE_ART.posts[1]} tone="mid" crease="faint" />
    <Solid paths={BRIDGE_ART.beam} tone="mid" crease="faint" />
    <Dots points={BRIDGE_ART.beamScrews} size={0.5} tone="mid" />
    <Line d={BRIDGE_ART.slot} tone="lo" />
    <Line d={BRIDGE_ART.scaleBase} tone="lo" />
    <Line d={BRIDGE_ART.scaleMinor} tone="lo" />
    <Line d={BRIDGE_ART.scaleMajor} tone="mid" />
  </g>
);

const CARRIAGE = (
  <g key="carriage">
    <Solid paths={BRIDGE_ART.penRod} tone="hi" lit crease="none" />
    <Solid paths={BRIDGE_ART.penCollar} tone="mid" crease="faint" />
    <Solid paths={BRIDGE_ART.carriage} tone="mid" crease="faint" />
    <Line d={BRIDGE_ART.carriageSeam} tone="faint" />
    <Dots points={BRIDGE_ART.carriageScrews} size={0.45} tone="mid" />
    <Solid paths={BRIDGE_ART.linkPin} tone="mid" crease="faint" />
  </g>
);

const CONTROLS = (
  <g key="controls">
    <Line d={SEL_ART.rim} tone="faint" />
    <Line d={SEL_ART.minor} tone="lo" />
    <Line d={SEL_ART.major} tone="mid" />
    <Solid paths={SEL_ART.body} tone="mid" crease="faint" />
    <Line d={SEL_ART.knurl} tone="lo" />
    <Line d={SEL_ART.hub} tone="lo" />
    <Line d={TERMS_ART.rim} tone="faint" />
    <Line d={TERMS_ART.minor} tone="lo" />
    <Line d={TERMS_ART.major} tone="mid" />
    <Solid paths={TERMS_ART.body} tone="mid" crease="faint" />
    <Line d={TERMS_ART.knurl} tone="lo" />
    <Line d={TERMS_ART.hub} tone="lo" />
    <Solid paths={RUN_ART.base} tone="mid" crease="faint" />
    <Dots points={RUN_ART.screws} size={0.4} tone="mid" />
  </g>
);

const lever = (parts: typeof RUN_ART.on) => parts.map((paths, index) => <Solid key={index} paths={paths} tone="mid" crease="faint" />);

const LABEL =
  "A harmonic chart recorder. A tower of spinning discs stands on a pedestal at the left, one disc per sine term, each disc carrying the pivot of the next, driven by a motor behind it. A link rod runs from the top of the tower to a pen carriage on a bridge over a paper strip; the carriage can only slide across the strip, so the pen's position is the sum of the terms. The paper rolls under the pen on two sprocketed rollers and records the sum. A selector knob picks one of six series and a second knob sets how many terms are engaged.";

export function RecorderArt() {
  return (
    <RecorderLive
      label={LABEL}
      base={BASE}
      motor={MOTOR}
      paper={PAPER}
      bridgeBack={BRIDGE_BACK}
      bridgeFront={BRIDGE_FRONT}
      carriage={CARRIAGE}
      controls={CONTROLS}
      runOn={<g key="run-on">{lever(RUN_ART.on)}</g>}
      runOff={<g key="run-off">{lever(RUN_ART.off)}</g>}
      clipPath={PAPER_ART.clip}
    />
  );
}
