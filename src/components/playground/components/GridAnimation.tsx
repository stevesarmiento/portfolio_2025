import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function GridAnimation() {
  // Define the positions of dots (column, row)
  const dotPositions = [
    { start: [0, 0], end: [8, 0] },
    { start: [10, 3], end: [3, 1] },
    { start: [1, 4], end: [7, 1] },
    { start: [5, 0], end: [9, 2] },
    { start: [10, 6], end: [2, 3] },
    { start: [0, 2], end: [9, 3] },
    { start: [4, 6], end: [9, 4] },
    { start: [2, 0], end: [7, 5] },
    { start: [0, 5], end: [5, 6] },
    { start: [10, 1], end: [6, 6] },
    { start: [3, 3], end: [9, 6] },
    { start: [8, 6], end: [4, 1] }
  ];

  const getRandomOrigin = () => {
    const positions = ['start', 'center', 'end'];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    return randomPos;
  };


  return (
    <Card className="w-[300px] border-[1px] h-[200px] shadow-none overflow-hidden rounded-3xl">
      <div className="relative w-full h-full">
        {/* Vertical lines */}
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: 11 }).map((_, i) => {
            const originY = getRandomOrigin();
            return (
              <motion.div 
                key={`v${i}`} 
                className={`w-[1px] h-full bg-gray-200 ${
                  originY === 'start' ? 'origin-top' : 
                  originY === 'center' ? 'origin-center' : 
                  'origin-bottom'
                }`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </div>
        
        {/* Horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 7 }).map((_, i) => {
            const originX = getRandomOrigin();
            return (
              <motion.div 
                key={`h${i}`} 
                className={`w-full h-[1px] bg-gray-200 ${
                  originX === 'start' ? 'origin-left' : 
                  originX === 'center' ? 'origin-center' : 
                  'origin-right'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + (i * 0.1),
                  ease: "easeOut"
                }}
              />
            );
          })}
        </div>
        
        {/* Dots with trails */}
        {dotPositions.map(({ start, end }, i) => {
          const trailLength = 64; 
          const trailSpacing = 0.01;
          
          const variants = {
            initial: { 
              opacity: 0,
              left: `${(start[0] / 10) * 100}%`,
              top: `${(start[1] / 6) * 100}%`,
            },
            fadeIn: {
              opacity: 1,
              transition: {
                duration: 0.3,
                delay: 1.8 + (i * 0.05)
              }
            },
            moveHorizontal: {
              left: `${(end[0] / 10) * 100}%`,
              transition: {
                duration: 0.4,
                delay: 2.1 + (i * 0.05),
                type: "spring",
                stiffness: 100,
                damping: 20
              }
            },
            moveVertical: {
              top: `${(end[1] / 6) * 100}%`,
              transition: {
                duration: 0.4,
                delay: 2.5 + (i * 0.05),
                type: "spring",
                stiffness: 100,
                damping: 20
              }
            }
          };

          return (
            <div key={i}>
              {/* Trail dots */}
              {Array.from({ length: trailLength }).map((_, trailIndex) => (
                <motion.div
                  key={`trail-${trailIndex}`}
                  className="absolute rounded-full"
                  initial="initial"
                  animate={["fadeIn", "moveHorizontal", "moveVertical"]}
                  variants={{
                    ...variants,
                    initial: {
                      ...variants.initial,
                      opacity: 0
                    },
                    fadeIn: {
                      opacity: 0.2 - (trailIndex * 0.025),
                      transition: {
                        duration: 0.3,
                        delay: (1.8 + (i * 0.05)) + (trailIndex * trailSpacing)
                      }
                    },
                    moveHorizontal: {
                      ...variants.moveHorizontal,
                      transition: {
                        ...variants.moveHorizontal.transition,
                        delay: (2.1 + (i * 0.05)) + (trailIndex * trailSpacing)
                      }
                    },
                    moveVertical: {
                      ...variants.moveVertical,
                      transition: {
                        ...variants.moveVertical.transition,
                        delay: (2.5 + (i * 0.05)) + (trailIndex * trailSpacing)
                      }
                    }
                  }}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    width: `${6 - (trailIndex * 0.3)}px`,
                    height: `${6 - (trailIndex * 0.3)}px`,
                    backgroundColor: 'rgb(156 163 175)',
                    opacity: 0.2 - (trailIndex * 0.015)
                  }}
                />
              ))}

              {/* Main dot */}
              <motion.div
                className="absolute w-2 h-2 bg-gray-400 rounded-full"
                initial="initial"
                animate={["fadeIn", "moveHorizontal", "moveVertical"]}
                variants={variants}
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          );
        })}
      </div>
    </Card>
  )
}