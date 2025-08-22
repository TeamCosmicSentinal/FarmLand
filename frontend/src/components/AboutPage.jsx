import React from 'react';

const team = [
  { name: 'Sonu Jha', role: 'Project Lead & Backend Developer', email: 'sonujha@example.com' },
  { name: 'Amit Kumar', role: 'Frontend Developer', email: 'amitkumar@example.com' },
  { name: 'Priya Singh', role: 'AI/ML Specialist', email: 'priyasingh@example.com' },
  { name: 'Ravi Patel', role: 'UI/UX Designer', email: 'ravipatel@example.com' },
];

function AboutPage() {
  return (
    <section className="bg-gradient-to-br from-sky via-background to-sky-light rounded-2xl shadow-lg border border-primary/10 min-h-[40vh] animate-fade-in">
      <div className="container-custom py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3">
          <h2 className="text-4xl font-heading font-bold text-primary mb-4 relative inline-block">
            About AgriGuru
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-xl text-text mt-6 max-w-3xl mx-auto leading-relaxed">
            AgriGuru is a passion project developed by a dedicated team of students and professionals, aiming to empower farmers with the latest AI technology. Our mission is to make advanced agricultural knowledge accessible, actionable, and easy to use for everyone.
          </p>
        </div>
        
        <div className="mb-16 bg-background-alt rounded-xl p-8 shadow-sm border border-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center bg-primary text-white rounded-full w-10 h-10 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <h3 className="text-2xl font-heading font-bold text-primary">Meet the Team</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map(member => (
              <div 
                key={member.email} 
                className="bg-card rounded-xl p-6 shadow-md border border-primary/10 flex flex-col gap-3 hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-background-alt rounded-full p-3 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-bold text-primary mb-1">{member.name}</h4>
                    <p className="text-text mb-2">{member.role}</p>
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-accent hover:text-primary flex items-center gap-1 text-sm transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-primary/10 pt-8 mt-8 text-text-muted text-center">
          <p className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            &copy; {new Date().getFullYear()} AgriGuru Team. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;