// app/api/ai/career/route.ts – AI-powered career guidance
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const { prompt, type } = await req.json();

  const profile = await prisma.profile.findUnique({ where: { userId } });

  // Build context from user profile
  const context = profile ? `
    User Profile:
    - Department: ${profile.department ?? 'Not specified'}
    - Batch: ${profile.batchYear ?? 'Not specified'}
    - Current Role: ${profile.currentRole ?? 'Student'}
    - Current Company: ${profile.currentCompany ?? 'Not employed'}
    - Skills: ${profile.skills.join(', ') || 'None listed'}
    - Years of Experience: ${profile.yearsExperience ?? 0}
    - Location: ${profile.city ?? 'India'}, ${profile.country ?? 'India'}
  ` : 'No profile data available';

  const systemPrompt = type === 'resume'
    ? `You are an expert resume reviewer for engineering students and alumni. Analyze the provided resume content and give specific, actionable feedback on: 1) Overall structure and formatting, 2) Skills section, 3) Experience descriptions (using STAR method), 4) Education section, 5) ATS optimization. Be concise and practical.`
    : type === 'career'
    ? `You are a career advisor for engineering college alumni. Based on the user's profile, suggest 3-5 specific career paths with: role names, required skills to learn, estimated salary range in India, companies to target, and a 6-month action plan. Be specific and realistic.`
    : `You are an AI assistant for an Alumni Portal. Help students and alumni with career guidance, networking advice, interview preparation, and professional development. Be helpful, specific, and encouraging.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nUser question/request: ${prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? 'Unable to generate response.';

    return NextResponse.json({ response: text });
  } catch (err) {
    // Fallback response if AI unavailable
    return NextResponse.json({
      response: `Based on your profile as a ${profile?.department ?? 'engineering'} graduate, here are some suggestions:\n\n1. **Strengthen core skills**: Focus on ${profile?.skills.slice(0, 2).join(' and ') || 'your technical skills'}\n2. **Network actively**: Connect with alumni in your target companies\n3. **Build projects**: Create portfolio projects that showcase your skills\n4. **Prepare for interviews**: Practice DSA and system design problems\n5. **Get certifications**: Cloud certifications (AWS/GCP/Azure) are highly valued\n\nFeel free to ask more specific questions!`,
    });
  }
}
