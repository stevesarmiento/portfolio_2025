import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

type GridPoint = [number, number];
type GridOrigin = "start" | "center" | "end";

interface DotPath {
  start: GridPoint;
  bend: GridPoint;
  end: GridPoint;
  bendProgress: number;
  duration: number;
}

interface GridAnimationProps {
  seed: number;
}

const DOT_COUNT = 12;
const TRAIL_LENGTH = 8;
const PATH_EASE = [0.65, 0, 0.35, 1] as const;

function createRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function createGridScene(seed: number) {
  const random = createRandom(seed);
  const origins: GridOrigin[] = ["start", "center", "end"];
  const verticalOrigins = Array.from(
    { length: 9 },
    () => origins[Math.floor(random() * origins.length)],
  );
  const horizontalOrigins = Array.from(
    { length: 5 },
    () => origins[Math.floor(random() * origins.length)],
  );
  const points = Array.from({ length: 9 * 5 }, (_, index): GridPoint => [
    (index % 9) + 1,
    Math.floor(index / 9) + 1,
  ]);
  const starts = shuffle(points, random).slice(0, DOT_COUNT);
  const usedEnds = new Set<string>();

  const paths = starts.map((start): DotPath => {
    const candidates = points.filter(([x, y]) => {
      const isUnused = !usedEnds.has(`${x}-${y}`);
      const usesBothAxes = x !== start[0] && y !== start[1];
      const hasEnoughDistance =
        Math.abs(x - start[0]) + Math.abs(y - start[1]) >= 4;

      return isUnused && usesBothAxes && hasEnoughDistance;
    });
    const end = candidates[Math.floor(random() * candidates.length)];
    usedEnds.add(`${end[0]}-${end[1]}`);

    const horizontalFirst = random() > 0.5;
    const bend: GridPoint = horizontalFirst
      ? [end[0], start[1]]
      : [start[0], end[1]];
    const firstLeg =
      Math.abs(bend[0] - start[0]) + Math.abs(bend[1] - start[1]);
    const secondLeg =
      Math.abs(end[0] - bend[0]) + Math.abs(end[1] - bend[1]);
    const distance = firstLeg + secondLeg;

    return {
      start,
      bend,
      end,
      bendProgress: firstLeg / distance,
      duration: Math.min(1.05, 0.65 + distance * 0.045),
    };
  });

  return { horizontalOrigins, paths, verticalOrigins };
}

function toLeft([column]: GridPoint) {
  return `${(column / 10) * 100}%`;
}

function toTop([, row]: GridPoint) {
  return `${(row / 6) * 100}%`;
}

export default function GridAnimation({ seed }: GridAnimationProps) {
  const { horizontalOrigins, paths, verticalOrigins } = createGridScene(seed);

  return (
    <Card className="h-[200px] w-[300px] overflow-hidden rounded-3xl border shadow-none">
      <div className="relative h-full w-full">
        <div className="absolute inset-0">
          {verticalOrigins.map((origin, index) => (
            <motion.div
              key={`v${index}`}
              className={`absolute h-full w-px bg-gray-200 ${
                origin === "start"
                  ? "origin-top"
                  : origin === "center"
                    ? "origin-center"
                    : "origin-bottom"
              }`}
              style={{ left: `${(index + 1) * 10}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.3,
                delay: (index + 1) * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {horizontalOrigins.map((origin, index) => (
            <motion.div
              key={`h${index}`}
              className={`absolute h-px w-full bg-gray-200 ${
                origin === "start"
                  ? "origin-left"
                  : origin === "center"
                    ? "origin-center"
                    : "origin-right"
              }`}
              style={{ top: `${((index + 1) / 6) * 100}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + (index + 1) * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {paths.map(({ start, bend, end, bendProgress, duration }, index) => {
          const left = [toLeft(start), toLeft(bend), toLeft(end)];
          const top = [toTop(start), toTop(bend), toTop(end)];
          const pathDelay = 2.05 + index * 0.045;
          const times = [0, bendProgress, 1];

          return (
            <div key={`${start.join("-")}-${end.join("-")}`}>
              {Array.from({ length: TRAIL_LENGTH }).map((_, trailIndex) => {
                const trailDelay = pathDelay + trailIndex * 0.018;

                return (
                  <motion.div
                    key={`trail-${trailIndex}`}
                    className="absolute rounded-full bg-gray-400"
                    initial={{
                      left: toLeft(start),
                      top: toTop(start),
                      opacity: 0,
                    }}
                    animate={{
                      left,
                      top,
                      opacity: 0.2 - trailIndex * 0.02,
                    }}
                    transition={{
                      left: {
                        duration,
                        delay: trailDelay,
                        ease: PATH_EASE,
                        times,
                      },
                      top: {
                        duration,
                        delay: trailDelay,
                        ease: PATH_EASE,
                        times,
                      },
                      opacity: {
                        duration: 0.25,
                        delay: 1.75 + index * 0.045 + trailIndex * 0.018,
                      },
                    }}
                    style={{
                      transform: "translate(-50%, -50%)",
                      width: `${6 - trailIndex * 0.3}px`,
                      height: `${6 - trailIndex * 0.3}px`,
                    }}
                  />
                );
              })}

              <motion.div
                className="absolute h-2 w-2 rounded-full bg-gray-400"
                initial={{
                  left: toLeft(start),
                  top: toTop(start),
                  opacity: 0,
                }}
                animate={{ left, top, opacity: 1 }}
                transition={{
                  left: {
                    duration,
                    delay: pathDelay,
                    ease: PATH_EASE,
                    times,
                  },
                  top: {
                    duration,
                    delay: pathDelay,
                    ease: PATH_EASE,
                    times,
                  },
                  opacity: {
                    duration: 0.25,
                    delay: 1.75 + index * 0.045,
                  },
                }}
                style={{ transform: "translate(-50%, -50%)" }}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
