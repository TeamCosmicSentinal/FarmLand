import React from 'react';

const team = [
  { name: 'Sonu Jha', role: 'Project Lead & Backend Developer', email: 'sonujha@example.com' },
  { name: 'Amit Kumar', role: 'Frontend Developer', email: 'amitkumar@example.com' },
  { name: 'Priya Singh', role: 'AI/ML Specialist', email: 'priyasingh@example.com' },
  { name: 'Ravi Patel', role: 'UI/UX Designer', email: 'ravipatel@example.com' },
];

function AboutPage() {
  return (
    <section className="bg-sky text-olive py-12 px-4 md:px-8 rounded-2xl shadow-card min-h-[60vh]">
      <div className="max-w-3xl mx-auto pt-6">
        <h2 className="text-4xl font-heading font-bold mb-2">About AgriGuru</h2>
        <div className="divider" />
        <p className="text-lg text-black mb-8 font-sans">
          AgriGuru is a passion project developed by a dedicated team of students and professionals, aiming to empower farmers with the latest AI technology. Our mission is to make advanced agricultural knowledge accessible, actionable, and easy to use for everyone.
        </p>
        <h3 className="text-2xl font-heading text-leaf font-semibold mb-4">Meet the Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map(member => (
            <div key={member.email} className="bg-offwhite rounded-2xl p-6 shadow-card border border-hemlock flex flex-col gap-2 hover:scale-[1.03] transition-all duration-200">
              <h4 className="text-xl font-heading font-semibold text-leaf mb-1">{member.name}</h4>
              <p className="text-black mb-1 font-sans">{member.role}</p>
              <a href={`mailto:${member.email}`} className="text-black hover:underline text-sm font-sans underline-offset-2">{member.email}</a>
            </div>
          ))}
        </div>
        <div className="divider" />
        <div className="mt-8 text-black text-sm text-center">
          &copy; {new Date().getFullYear()} AgriGuru Team. All rights reserved.
        </div>
      </div>
    </section>
  );
}

export default AboutPage; 