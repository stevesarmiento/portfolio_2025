"use client";

import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { projects } from '@/data/project';
import { ProjectCard } from '@/components/ui/project-card';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog-portfolio';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconChevronLeft, IconChevronRight, IconXmark } from "symbols-react";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Work() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const handleNavigate = (newDirection: 'prev' | 'next') => {
    if (selectedProjectIndex === null) return;
    
    setDirection(newDirection === 'next' ? 'right' : 'left');
    const newIndex = newDirection === 'next' 
      ? (selectedProjectIndex + 1) % projects.length
      : (selectedProjectIndex - 1 + projects.length) % projects.length;
    
    setSelectedProjectIndex(newIndex);
  };

  const selectedProject = selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      filter: 'blur(30px)',
      opacity: 0
    }),
    center: {
      x: 0,
      filter: 'blur(0px)',
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : 1000,
      filter: 'blur(30px)',
      opacity: 0
    })
  };

  return (
    <div className="w-[300px] mx-auto sm:w-full">
      <TooltipProvider>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => {
                  setSelectedProjectIndex(index);
                  setIsDialogOpen(true);
                }}
              />
            ))}
          </div>

          {selectedProject && (
            <DialogContent className="px-4 w-full sm:max-w-6xl h-[100vh]">
              <DialogTitle>
                <div className="flex justify-between p-6">
                  <div className="flex flex-row items-center gap-x-2">
                    <button
                      onClick={() => handleNavigate('prev')}
                      className="z-50 p-2 rounded-full bg-black/10 hover:bg-black/5 transition-colors"
                      aria-label="Previous project"
                    >
                      <IconChevronLeft className="w-3.5 h-3.5 fill-black/80" />
                    </button>
                    <button
                      onClick={() => handleNavigate('next')}
                      className="z-50 p-2 rounded-full bg-black/10 hover:bg-black/5 transition-colors"
                      aria-label="Next project"
                    >
                      <IconChevronRight className="w-3.5 h-3.5 fill-black/80" />
                    </button>                    
                  </div>
                  <DialogClose asChild>
                    <button className="z-50 p-2 rounded-full bg-black/10 hover:bg-black/5 transition-colors">
                      <IconXmark className="w-3 h-3 fill-black/80" />
                    </button>
                  </DialogClose>
                </div>
              </DialogTitle>
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={selectedProject.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="flex flex-row h-full"
                >
                  {/* Sticky Text Column */}
                  <div className="w-1/2 sticky top-0 h-fit p-8 space-y-4">
                    <Image 
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      width={60}
                      height={60}
                      className="rounded-2xl shadow-xl shadow-slate-400/20 border-slate-700/20 border-[1px]"
                    />
                    <h2 className="text-4xl font-bold text-black/90 font-sans">
                      {selectedProject.title}
                    </h2>
                    <p className="text-black/70">{selectedProject.description}</p>
                    {selectedProject.body && (
                      <div className="text-black/70">{selectedProject.body.intro}</div>
                    )}
                    {selectedProject.body?.details?.map((detail, index) => (
                      <div key={index} className="text-black/70">{detail}</div>
                    ))}
                    <a 
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-black/70 hover:text-black/90 transition-colors"
                    >
                      View Work →
                    </a>
                  </div>

                  {/* Scrollable Images Column */}
                  <ScrollArea className="w-1/2 h-full border-l border-[#2E4D61]/30 border-dashed">
                    <div className="p-8 space-y-8">
                      {selectedProject.images && (
                        <div className="grid grid-cols-1 gap-8">
                          {selectedProject.images.map((img, index) => (
                            <Image 
                              key={index}
                              src={img}
                              alt={`${selectedProject.title} screenshot ${index + 1}`}
                              width={600}
                              height={600}
                              className="rounded-xl"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              </AnimatePresence>
            </DialogContent>
          )}
        </Dialog>
      </TooltipProvider>      
    </div>
  );
}