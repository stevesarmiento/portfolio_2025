import { Plate } from "@/components/iso/react/draw";
import { WaveBoxArt } from "./art";
import { GAMMA_DEFAULT, OMEGA_DEFAULT, T0, T_MAX, readoutOf } from "./model";
import "./wavebox.css";

export function WaveBoxFigure({ fig = "Fig 1" }: { fig?: string }) {
  return (
    <Plate
      fig={fig}
      title="Complex wave packet"
      hint="Drag the sled · turn the knobs"
      readout={readoutOf(0, OMEGA_DEFAULT, GAMMA_DEFAULT)}
      keys={[
        { mark: "lit", label: "The point at time t, and the wire drawn so far" },
        { mark: "raised", label: "The helical wire: the packet in 3-D" },
        { mark: "dashed", label: "Drops from the point to its real and imaginary projections" },
      ]}
      caption={`f(t) = e^(−γ(t−t₀)²)·e^(iωt) wound around a rod from t = 0 to ${T_MAX}, centred at t₀ = ${T0}. The real part reaches toward you, the imaginary part rises. The wall shows Im f = e^(−γ(t−t₀)²) sin ωt, the floor Re f = e^(−γ(t−t₀)²) cos ωt, and the end panel the whole packet head-on. At rest ω = ${OMEGA_DEFAULT} and γ = ${GAMMA_DEFAULT}.`}
    >
      <WaveBoxArt />
    </Plate>
  );
}
