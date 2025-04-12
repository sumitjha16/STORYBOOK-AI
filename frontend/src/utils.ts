import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Helper function to process in-line bold formatting
function processBoldText(text: string): string {
  // Replace all occurrences of **text** with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Improved structured content formatter with consistent styling
export function formatStructuredContent(content: string): string {
  // Split the content by double newlines to separate sections
  const sections = content.split('\n\n');
  
  const formattedSections = sections.map(section => {
    // Check if section starts with a title (wrapped in **)
    const titleMatch = section.match(/^\*\*(.*?)\*\*/);
    
    if (titleMatch) {
      // Extract the title without asterisks
      const title = titleMatch[1];
      
      // Get content after the title
      let contentAfterTitle = section.substring(section.indexOf('**' + title + '**') + title.length + 4).trim();
      
      // Process any remaining bold text in the contentAfterTitle
      contentAfterTitle = processBoldText(contentAfterTitle);
      
      // Process content for bullet points
      // First handle content that doesn't have explicit bullet points but needs paragraphs
      if (!contentAfterTitle.includes('\n- ')) {
        return `<div class="section-container mb-4">
          <h3 class="font-bold underline mb-2">${title}</h3>
          <p>${contentAfterTitle}</p>
        </div>`;
      }
      
      // Process bullet points if they exist
      const bulletPoints = contentAfterTitle.split('\n- ');
      const formattedBulletPoints = bulletPoints
        .filter((point, index) => index === 0 ? point.trim().length > 0 : true)
        .map((point, index) => {
          if (index === 0 && !point.startsWith('- ')) {
            return point.trim().length > 0 ? `<p class="mb-2">${point.trim()}</p>` : '';
          }
          return `<li class="mb-1">${point.trim()}</li>`;
        })
        .join('');
      
      return `<div class="section-container mb-4">
        <h3 class="font-bold underline mb-2">${title}</h3>
        ${bulletPoints.length > 1 ? 
          `<ul class="list-disc pl-5 space-y-1 mb-2">${formattedBulletPoints}</ul>` : 
          formattedBulletPoints}
      </div>`;
    } else {
      // Process any bold text in regular paragraphs
      const processedSection = processBoldText(section);
      return `<p class="mb-3">${processedSection}</p>`;
    }
  });
  
  return formattedSections.join('\n');
}