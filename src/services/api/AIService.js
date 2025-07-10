import mockSuggestions from "@/services/mockData/suggestions.json";

class AIService {
  constructor() {
    this.suggestions = [...mockSuggestions];
  }

  async generateSuggestions(entities, connections) {
    await this.delay(400);
    
    const suggestions = [];
    
    // Welcome message for empty structures
    if (entities.length === 0) {
      suggestions.push({
        id: "welcome",
        message: "Hey there! Mark Kohler here (well, his AI twin). Ready to build a tax structure that'll make the IRS jealous? Let's start with a Trust - it's like a financial superhero cape for your assets!",
        type: "tip",
        relatedEntities: []
      });
      return suggestions;
    }

    // Check for single entity structures
    if (entities.length === 1) {
      const entity = entities[0];
      suggestions.push({
        id: `single-${entity.type}`,
        message: `Nice start with that ${entity.type}! But remember, one entity is like having one tool in your toolbox - it works, but you're missing out on the real magic. Consider adding an LLC for investment holdings or an S Corp for active business income. Diversification isn't just for investments, it's for entities too!`,
        type: "optimization",
        relatedEntities: [entity.id]
      });
    }

    // Check for Trust without LLC
    const hasTrust = entities.some(e => e.type === "Trust");
    const hasLLC = entities.some(e => e.type === "LLC");
    
    if (hasTrust && !hasLLC) {
      suggestions.push({
        id: "trust-needs-llc",
        message: "I see you've got a Trust - smart move! But here's the thing: your Trust is like a vault, but you need something to actually DO business. Add an LLC to hold your investments and business activities. Think of it as the Trust's business-savvy cousin who actually goes out and makes money!",
        type: "tip",
        relatedEntities: entities.filter(e => e.type === "Trust").map(e => e.id)
      });
    }

    // Check for LLC without S Corp for active business
    const hasSCorp = entities.some(e => e.type === "SCorp");
    
    if (hasLLC && !hasSCorp) {
      suggestions.push({
        id: "llc-needs-scorp",
        message: "You've got LLCs - excellent! But if you're actively working IN the business (not just owning it), you're missing a HUGE tax-saving opportunity. Add an S Corp to slash your self-employment taxes. It's like having a tax reduction machine that works while you sleep!",
        type: "optimization",
        relatedEntities: entities.filter(e => e.type === "LLC").map(e => e.id)
      });
    }

    // Check for missing Form 1040
    const hasForm1040 = entities.some(e => e.type === "Form1040");
    
    if (entities.length >= 2 && !hasForm1040) {
      suggestions.push({
        id: "missing-form1040",
        message: "Hold up! You've got this beautiful structure, but where's your Form 1040? That's where all the tax magic happens - it's like having a symphony without a conductor. Add your personal tax return to see how everything flows together!",
        type: "warning",
        relatedEntities: []
      });
    }

    // Check for entities without connections
    const unconnectedEntities = entities.filter(entity => 
      !connections.some(conn => conn.from === entity.id || conn.to === entity.id)
    );
    
    if (unconnectedEntities.length > 0 && entities.length > 1) {
      suggestions.push({
        id: "unconnected-entities",
        message: `You've got ${unconnectedEntities.length} entities just sitting there like wallflowers at a dance! Connect them to show ownership and income flow. Remember, isolated entities are like having separate bank accounts that don't talk to each other - inefficient and potentially problematic!`,
        type: "warning",
        relatedEntities: unconnectedEntities.map(e => e.id)
      });
    }

    // Check for proper structure progression
    if (entities.length >= 3 && connections.length >= 2) {
      suggestions.push({
        id: "great-progress",
        message: "Now we're cooking with gas! You're building a structure that would make any tax strategist proud. Don't forget to consider the state where you're forming these entities - some states are like tax havens, others are like... well, let's just say they're not. Wyoming and Nevada are my personal favorites!",
        type: "tip",
        relatedEntities: []
      });
    }

    // Advanced optimization suggestions
    if (entities.length >= 4) {
      suggestions.push({
        id: "advanced-optimization",
        message: "Wow! You're in the advanced leagues now! With this many entities, you're probably ready for some ninja-level tax strategies. Consider how each entity's tax elections work together - it's like conducting a tax orchestra where every instrument needs to be in perfect harmony!",
        type: "optimization",
        relatedEntities: []
      });
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AIService();