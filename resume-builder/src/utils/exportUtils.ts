import { ResumeData } from '../types';

declare global {
  interface Window {
    html2canvas?: any;
  }
}

export function exportToJson(data: ResumeData, filename = '我的简历数据.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File): Promise<ResumeData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.personalInfo) {
          throw new Error('格式不符合简历数据结构');
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
}

export function exportToMarkdown(data: ResumeData): string {
  const { personalInfo, summary, workExperience, projectExperience, education, skills, awards, customSections } = data;
  let md = `# ${personalInfo.name || '个人简历'}\n\n`;
  if (personalInfo.targetJob) md += `**求职意向**：${personalInfo.targetJob}  \n`;
  const contactParts: string[] = [];
  if (personalInfo.phone) contactParts.push(`📞 ${personalInfo.phone}`);
  if (personalInfo.email) contactParts.push(`✉️ ${personalInfo.email}`);
  if (personalInfo.location) contactParts.push(`📍 ${personalInfo.location}`);
  if (personalInfo.experienceYears) contactParts.push(`💼 ${personalInfo.experienceYears}`);
  if (personalInfo.educationLevel) contactParts.push(`🎓 ${personalInfo.educationLevel}`);
  if (personalInfo.website) contactParts.push(`🌐 [主页/作品集](${personalInfo.website})`);

  md += `${contactParts.join(' | ')}\n\n`;

  if (summary) {
    md += `## 个人简介\n\n${summary}\n\n`;
  }

  if (workExperience && workExperience.length > 0) {
    md += `## 工作经历\n\n`;
    workExperience.forEach((item) => {
      md += `### ${item.company} | ${item.role} (${item.startDate} - ${item.endDate}${item.city ? ` · ${item.city}` : ''})\n`;
      if (item.highlights && item.highlights.length > 0) {
        item.highlights.forEach((hl) => {
          if (hl.trim()) md += `- ${hl}\n`;
        });
      }
      md += `\n`;
    });
  }

  if (projectExperience && projectExperience.length > 0) {
    md += `## 项目经历\n\n`;
    projectExperience.forEach((item) => {
      md += `### ${item.name} | ${item.role} (${item.startDate} - ${item.endDate})\n`;
      if (item.techStack) md += `**技术栈 / 工具**：${item.techStack}\n\n`;
      if (item.highlights && item.highlights.length > 0) {
        item.highlights.forEach((hl) => {
          if (hl.trim()) md += `- ${hl}\n`;
        });
      }
      md += `\n`;
    });
  }

  if (education && education.length > 0) {
    md += `## 教育背景\n\n`;
    education.forEach((item) => {
      md += `### ${item.school} | ${item.major} (${item.degree}) | ${item.startDate} - ${item.endDate}\n`;
      if (item.gpa) md += `- GPA / 排名: ${item.gpa}\n`;
      if (item.details) md += `- ${item.details}\n`;
      md += `\n`;
    });
  }

  if (skills && skills.length > 0) {
    md += `## 专业技能\n\n`;
    skills.forEach((item) => {
      md += `- **${item.name}**：${item.skills}\n`;
    });
    md += `\n`;
  }

  if (awards && awards.length > 0) {
    md += `## 荣誉与证书\n\n`;
    awards.forEach((item) => {
      md += `- ${item.name} (${item.date}${item.issuer ? ` · ${item.issuer}` : ''})\n`;
    });
    md += `\n`;
  }

  if (customSections && customSections.length > 0) {
    customSections.forEach((item) => {
      md += `## ${item.title}\n\n${item.content}\n\n`;
    });
  }

  return md;
}

export function downloadMarkdown(data: ResumeData, filename = '简历.md'): void {
  const md = exportToMarkdown(data);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPng(elementId: string, filename = '简历.png'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('未找到简历内容节点');
    return false;
  }

  if (!window.html2canvas) {
    alert('正在加载图片渲染引擎，请稍后再试或直接使用浏览器打印');
    return false;
  }

  try {
    const canvas = await window.html2canvas(element, {
      scale: 2, // Retina 2x resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to export PNG:', err);
    alert('导出图片失败，推荐使用“打印 / 导出 PDF”功能。');
    return false;
  }
}
