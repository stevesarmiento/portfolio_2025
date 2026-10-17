import * as React from "react";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { BASE_ART, DIAL_ART, FLOOR_ART, GAMMA_ART, LABEL_ART, OMEGA_ART, PANEL_ART, RAIL_ART, ROD_ART, RULER_ART, RUN_ART, WALL_ART } from "./geometry";
import { WaveBoxLive } from "./live";

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
    <Solid paths={FLOOR_ART.panel} tone="lo" crease="none" flat />
    <Line d={FLOOR_ART.grid} tone="faint" />
    <Line d={FLOOR_ART.frame} tone="lo" />
    <Line d={FLOOR_ART.t0} tone="lo" />
  </g>
);

const WALL = (
  <g key="wall">
    <Solid paths={WALL_ART.wall} tone="mid" crease="faint" />
    <Dots points={WALL_ART.screws} size={0.45} tone="mid" />
    <Line d={WALL_ART.grid} tone="faint" />
    <Line d={WALL_ART.frame} tone="lo" />
    <Line d={WALL_ART.t0} tone="lo" />
  </g>
);

const PANEL = (
  <g key="panel">
    <Solid paths={PANEL_ART.feet} tone="lo" crease="faint" />
    <Solid paths={PANEL_ART.stem} tone="mid" crease="faint" />
    <Solid paths={PANEL_ART.panel} tone="mid" crease="faint" />
    <Dots points={PANEL_ART.screws} size={0.45} tone="mid" />
    <Line d={PANEL_ART.halfRing} tone="faint" />
    <Line d={PANEL_ART.ring} tone="lo" />
    <Line d={PANEL_ART.axes} tone="lo" />
    <Dots points={PANEL_ART.axisEnds} size={0.45} tone="mid" />
  </g>
);

const POST_BACK = (
  <g key="post-back">
    <Solid paths={ROD_ART.postFeet[0]} tone="lo" crease="faint" />
    <Solid paths={ROD_ART.posts[0]} tone="mid" crease="faint" />
    <Solid paths={ROD_ART.caps[0]} tone="mid" crease="faint" />
  </g>
);

const ROD = (
  <g key="rod">
    <Solid paths={ROD_ART.rod} tone="mid" crease="none" />
    <Line d={ROD_ART.bores} tone="lo" />
  </g>
);

const POST_FRONT = (
  <g key="post-front">
    <Solid paths={ROD_ART.postFeet[1]} tone="lo" crease="faint" />
    <Solid paths={ROD_ART.posts[1]} tone="mid" crease="faint" />
    <Solid paths={ROD_ART.caps[1]} tone="mid" crease="faint" />
    <Dots points={ROD_ART.postScrews} size={0.5} tone="mid" />
  </g>
);

const RAIL = (
  <g key="rail">
    <Solid paths={RAIL_ART.rail} tone="mid" crease="faint" />
    <Line d={RAIL_ART.ruleBase} tone="lo" />
    <Line d={RAIL_ART.minor} tone="lo" />
    <Line d={RAIL_ART.major} tone="mid" />
    {RAIL_ART.stops.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Dots points={RAIL_ART.stopScrews} size={0.45} tone="mid" />
  </g>
);

const SLED = (
  <g key="sled">
    <Solid paths={RAIL_ART.sled} tone="hi" crease="lo" />
    <Line d={RAIL_ART.sledSeam} tone="faint" />
    <Dots points={RAIL_ART.sledScrews} size={0.45} tone="mid" />
    <Line d={RAIL_ART.index} tone="hi" />
    <Solid paths={RAIL_ART.mast} tone="mid" crease="none" />
    <Solid paths={RAIL_ART.mastCap} tone="mid" crease="faint" />
  </g>
);

const CONTROLS = (
  <g key="controls">
    {[OMEGA_ART, GAMMA_ART].map((art, index) => (
      <g key={index}>
        <Line d={art.rim} tone="faint" />
        <Line d={art.minor} tone="lo" />
        <Line d={art.major} tone="mid" />
        <Solid paths={art.body} tone="mid" crease="faint" />
        <Line d={art.knurl} tone="lo" />
        <Line d={art.hub} tone="lo" />
      </g>
    ))}
    <Solid paths={RUN_ART.base} tone="mid" crease="faint" />
    <Dots points={RUN_ART.screws} size={0.4} tone="mid" />
  </g>
);

const DIAL = (
  <g key="dial">
    <Solid paths={DIAL_ART.puck} tone="mid" crease="faint" />
    <Line d={DIAL_ART.band} tone="faint" />
    <Line d={DIAL_ART.seam} tone="faint" />
    <Line d={DIAL_ART.bezel} tone="lo" />
    <Line d={DIAL_ART.face} tone="faint" />
    <Line d={DIAL_ART.minor} tone="lo" />
    <Line d={DIAL_ART.major} tone="mid" />
  </g>
);

const lever = (parts: typeof RUN_ART.on) => parts.map((paths, index) => <Solid key={index} paths={paths} tone="mid" crease="faint" />);

const LABEL =
  "A projection box for a complex wave packet. A rod runs along the time axis between two posts, and a helical wire wound around it is the packet: its distance toward the viewer is the real part and its height the imaginary part. A back wall carries the imaginary projection, a floor panel the real projection, and an end panel at the left shows the wire head-on as a spiral in the complex plane. A sled on a rail in front marks the time; from the wire's point at that time, lines drop to both projections. Two knobs set the frequency ω and the width γ; a dial gauge reads the magnitude.";

export function WaveBoxArt() {
  return (
    <WaveBoxLive
      label={LABEL}
      base={BASE}
      wall={WALL}
      panel={PANEL}
      postBack={POST_BACK}
      rod={ROD}
      postFront={POST_FRONT}
      rail={RAIL}
      sled={SLED}
      controls={CONTROLS}
      dial={DIAL}
      dialLabel={DIAL_ART.label}
      runOn={<g key="run-on">{lever(RUN_ART.on)}</g>}
      runOff={<g key="run-off">{lever(RUN_ART.off)}</g>}
    />
  );
}
