// =====================================================================
// PORTFOLIO DATA: the ONLY file you edit for content.
// Media: put files in /public/media and write "/media/file.ext", or use a
// full direct URL (.mp4/.webm/.jpg). Leave "" for a clean placeholder.
// =====================================================================
export const portfolioData = {
  name: 'Krithik',
  title: 'VIDEO EDITOR / MOTION DESIGNER',
  profileImage: '', // '/media/portrait.jpg'

  hero: {
    headline: ['VISUAL', 'STORYTELLER'],
    supporting: 'Transforming ideas into cinematic visual experiences.',
  },

  beyond: {
    headline: ['BEYOND', 'THE FRAME'],
    text: 'Every cut, every transition and every frame is crafted to tell a powerful story.',
  },

  // ScrollExpand showreel. expandMedia: 'video' uses showreel.url, 'image' uses your portrait.
  showreel: { url: '', thumbnail: '', expandMedia: 'video' },

  projects: [
    { id: 1, category: 'CINEMATIC EDITS',      title: 'Project title', description: 'Describe this project.', thumbnail: '', video: '' },
    { id: 2, category: 'INSTAGRAM REELS',      title: 'Project title', description: 'Describe this project.', thumbnail: '', video: '' },
    { id: 3, category: 'COMMERCIAL ADS',       title: 'Project title', description: 'Describe this project.', thumbnail: '', video: '' },
    { id: 4, category: 'PROMOTIONAL VIDEOS',   title: 'Project title', description: 'Describe this project.', thumbnail: '', video: '' },
    { id: 5, category: 'MOTION GRAPHICS',      title: 'Project title', description: 'Describe this project.', thumbnail: '', video: '' },
  ],

  services: [
    { title: 'Professional Video Editing', text: 'Precise cutting, pacing and sound that carry your story.' },
    { title: 'Motion Graphics',            text: 'Titles, transitions and animated visuals that add polish.' },
    { title: 'Color Grading',              text: 'Consistent, cinematic color that sets the mood.' },
    { title: 'Social Media Reels',         text: 'Short-form edits made for vertical, fast-moving feeds.' },
    { title: 'Commercial Advertisements',  text: 'Ad edits focused on a clear message and strong finish.' },
    { title: 'Brand Films',                text: 'Longer-form storytelling that shows what a brand stands for.' },
  ],

  about: {
    intro: 'Write your professional introduction here.',
    philosophy: 'Describe your creative philosophy here.',
    approach: 'Describe your editing approach here.',
    experience: [{ role: 'Your role', place: 'Company or Freelance', period: 'Years', text: 'What you did.' }],
  },

  skills: ['Adobe Premiere Pro','Adobe After Effects','Blender','Motion Graphics','Color Grading','Sound Design','Visual Storytelling','Cinematic Editing'],

  contact: {
    email: '', whatsapp: '', instagram: '', linkedin: '', // whatsapp: digits with country code
    formEndpoint: '', // optional Formspree-style URL; empty = opens visitor's email app
  },
}
