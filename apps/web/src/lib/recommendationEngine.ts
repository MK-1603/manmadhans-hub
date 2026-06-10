export interface Tool {
  id: string;
  name: string;
  slug?: string;
  description: string;
  url: string;
  category_id: string;
  category_name?: string;

  model_version?: string;
  platform_type?: string;
  pricing_model?: string;
  developer_name?: string;
  launch_date?: string;
  is_archived: boolean;
  is_active: boolean;
  rating?: number;
  created_at: string;
  short_description?: string;
  use_case: string;
  key_features?: string | string[];
  search_keywords?: string | string[];
  integrations?: string | string[];
  tags?: string | string[];
  tool_status?: string;
  is_featured?: boolean;
  website_url?: string;
}

export function getRecommendedTools(
  tools: Tool[],
  userSavedIds: (string | number)[] = [],
  limit = 3,
  searchQuery = ''
): Tool[] {
  if (!tools || tools.length === 0) return [];
  
  // Only recommend tools with a star rating > 0
  const starTools = tools.filter(t => t.rating && t.rating > 0);
  if (starTools.length === 0) return [];

  // Find saved tools to understand user interest categories/tags
  const savedTools = starTools.filter(t => userSavedIds.includes(t.id));
  const preferredCategories = new Set(savedTools.map(t => t.category_id).filter(Boolean));
  const preferredTags = new Set(
    savedTools.flatMap(t => {
      if (Array.isArray(t.tags)) return t.tags;
      if (typeof t.tags === 'string') return t.tags.split(',').map(s => s.trim());
      return [];
    }).filter(Boolean)
  );

  // Score each tool
  const scoredTools = starTools.map(tool => {
    let score = 0;
    
    // Base rating score (0 - 5)
    if (tool.rating) {
      score += tool.rating;
    }
    
    // Featured bonus
    if (tool.is_featured) {
      score += 10;
    }
    
    // Category match bonus
    if (preferredCategories.has(tool.category_id)) {
      score += 3;
    }
    
    // Tags match bonus
    const toolTags = Array.isArray(tool.tags) 
      ? tool.tags 
      : (typeof tool.tags === 'string' ? tool.tags.split(',').map(s => s.trim()) : []);
    
    const matchingTags = toolTags.filter(tag => preferredTags.has(tag)).length;
    score += matchingTags * 0.5;

    // Search query matching (suggestion system)
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const name = (tool.name || '').toLowerCase();
      const desc = (tool.description || '').toLowerCase();
      const shortDesc = (tool.short_description || '').toLowerCase();
      const developer = (tool.developer_name || '').toLowerCase();
      const keywords = Array.isArray(tool.search_keywords)
        ? tool.search_keywords.map(k => k.toLowerCase())
        : (typeof tool.search_keywords === 'string' ? tool.search_keywords.toLowerCase().split(',').map(s => s.trim()) : []);
      
      // Exact name match
      if (name === q) {
        score += 200;
      }
      // Name starts with query
      else if (name.startsWith(q)) {
        score += 150;
      }
      // Name contains query
      else if (name.includes(q)) {
        score += 100;
      }

      // Keyword matches
      const keywordMatches = keywords.filter(k => k.includes(q) || q.includes(k)).length;
      score += keywordMatches * 20;

      // Tag matches
      const tagMatches = toolTags.filter(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())).length;
      score += tagMatches * 15;

      // Developer name match
      if (developer.includes(q)) {
        score += 40;
      }

      // Description matches
      if (desc.includes(q) || shortDesc.includes(q)) {
        score += 30;
      }
    }

    return { tool, score };
  });

  // Sort by score descending and return the top tools
  return scoredTools
    .sort((a, b) => b.score - a.score)
    .map(x => x.tool)
    .slice(0, limit);
}
