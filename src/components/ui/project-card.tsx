import Image from 'next/image';
import { DialogTrigger } from '@/components/ui/dialog-portfolio';
import { Project } from '@/types/project';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
      <DialogTrigger asChild>
            <motion.div
              onClick={onClick}
              whileHover={{ scale: 0.98 }}
              className="group relative h-[200px] rounded-[20px] overflow-hidden ring-[1px] transition-all duration-150 ease-in-out ring-white/5 hover:cursor-pointer saturate-0 hover:saturate-150"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-top"
                style={{ 
                  backgroundImage: `url(${project.backgroundUrl})`,
                  filter: 'brightness(1)'
                }} 
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
              
              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    width={60} 
                    height={60}
                    className="rounded-[16px] shadow-lg ring-1 ring-white/10 shadow-black/40"
                  />
                </div>
                
                {/* Bottom Section */}
                <div>
                  <h3 className="text-xl font-nuvo font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-sm text-white/70 line-clamp-2 w-full sm:w-[320px]">{project.content}</p>
                </div>
              </div>
            </motion.div>          
      </DialogTrigger>
  );
}