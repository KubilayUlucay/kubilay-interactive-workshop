import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Globe, Disc } from 'lucide-react';

// Your Real Project Data
const projects = [
  {
    title: "Axial Flux Motor",
    category: "HARDWARE",
    icon: <Zap size={24} />,
    desc: "Custom-built electric motor with hand-wired coils and 3D printed stator. Controlled via NRF24 wireless protocol.",
    tech: ["Arduino", "3D Printing", "PCB Design"]
  },
  {
    title: "Zumo Robot Vision",
    category: "ROBOTICS",
    icon: <Disc size={24} />,
    desc: "Autonomous navigation algorithm detecting obstacles and white boundary lines using IR sensors.",
    tech: ["C++", "Sensors", "Automation"]
  },
  {
    title: "Li-ion BMS",
    category: "POWER SYSTEMS",
    icon: <Activity size={24} />,
    desc: "Battery Management System with active cell balancing and STM32 control logic.",
    tech: ["STM32", "MATLAB", "Electronics"]
  },
  {
    title: "Deforestation Analysis",
    category: "DATA SCIENCE",
    icon: <Globe size={24} />,
    desc: "ML analysis of forest loss in Northeastern Turkey using satellite data.",
    tech: ["Python", "Data Analysis", "Research"]
  }
];

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(0, 243, 255, 0.05)', // Glass effect
        border: '1px solid rgba(0, 243, 255, 0.2)',
        borderRadius: '10px',
        padding: '20px',
        color: '#a0ecd0',
        backdropFilter: 'blur(5px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Corner Line */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '30px', height: '30px', borderTop: '2px solid #00f3ff', borderRight: '2px solid #00f3ff' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#00f3ff' }}>
        {project.icon}
        <span style={{ fontFamily: '"Share Tech Mono"', fontSize: '12px', letterSpacing: '1px' }}>{project.category}</span>
      </div>

      <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#fff' }}>{project.title}</h3>
      <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.5' }}>{project.desc}</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        {project.tech.map((t, i) => (
          <span key={i} style={{ fontSize: '10px', border: '1px solid #00f3ff', padding: '2px 8px', borderRadius: '2px', color: '#00f3ff' }}>
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default function Projects() {
  return (
    <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#00f3ff', fontFamily: '"Share Tech Mono"', fontSize: '24px', marginBottom: '40px', borderBottom: '1px solid rgba(0,243,255,0.3)', paddingBottom: '10px' }}>
        {'>'} ACTIVE_PROJECTS
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}