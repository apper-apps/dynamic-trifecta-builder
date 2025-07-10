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
        relatedEntities: [],
        actions: [
          {
            id: "add-trust",
            label: "Add Trust",
            type: "create_entity",
            entityType: "Trust"
          }
        ]
      });
      return suggestions;
    }

    // Check for single entity structures
    if (entities.length === 1) {
      const entity = entities[0];
      const actionType = entity.type === "Trust" ? "LLC" : "Trust";
      suggestions.push({
        id: `single-${entity.type}`,
        message: `Nice start with that ${entity.type}! But remember, one entity is like having one tool in your toolbox - it works, but you're missing out on the real magic. Consider adding an LLC for investment holdings or an S Corp for active business income. Diversification isn't just for investments, it's for entities too!`,
        type: "optimization",
        relatedEntities: [entity.id],
        actions: [
          {
            id: "add-llc",
            label: "Add LLC",
            type: "create_entity",
            entityType: "LLC"
          },
          {
            id: "add-scorp",
            label: "Add S Corp",
            type: "create_entity",
            entityType: "SCorp"
          }
        ]
      });
    }

    // Check for Trust without LLC - Rental Property Scenario
    const hasTrust = entities.some(e => e.type === "Trust");
    const hasLLC = entities.some(e => e.type === "LLC");
    
    if (hasTrust && !hasLLC) {
      suggestions.push({
        id: "trust-needs-llc",
        message: "I see you've got a Trust - smart move! But here's the thing: your Trust is like a vault, but you need something to actually DO business. Add an LLC to hold your investments and business activities. Think of it as the Trust's business-savvy cousin who actually goes out and makes money! Got rental property? That LLC should be in the same state as your rentals.",
        type: "tip",
        relatedEntities: entities.filter(e => e.type === "Trust").map(e => e.id),
        actions: [
          {
            id: "add-rental-llc",
            label: "Add Investment LLC",
            type: "create_entity",
            entityType: "LLC"
          }
        ]
      });
    }

    // Rental Property LLC State Suggestion
    if (hasLLC && hasTrust) {
      suggestions.push({
        id: "rental-property-state",
        message: "Pro tip from Uncle Mark: If you're holding rental properties in that LLC, make sure it's formed in the same state as your rentals! Out-of-state LLCs for in-state properties are like wearing a tuxedo to a beach party - technically legal, but you're missing the point. Foreign LLC fees and complications? No thank you!",
        type: "warning",
        relatedEntities: entities.filter(e => e.type === "LLC").map(e => e.id),
        actions: [
          {
            id: "review-llc-state",
            label: "Review LLC State",
            type: "info",
            message: "Consider forming LLCs in the same state as your rental properties"
          }
        ]
      });
    }

    // Check for LLC without S Corp for active business
    const hasSCorp = entities.some(e => e.type === "SCorp");
    
    if (hasLLC && !hasSCorp) {
      suggestions.push({
        id: "llc-needs-scorp",
        message: "You've got LLCs - excellent! But if you're actively working IN the business (not just owning it), you're missing a HUGE tax-saving opportunity. Add an S Corp to slash your self-employment taxes. It's like having a tax reduction machine that works while you sleep!",
        type: "optimization",
        relatedEntities: entities.filter(e => e.type === "LLC").map(e => e.id),
        actions: [
          {
            id: "add-scorp",
            label: "Add S Corp",
            type: "create_entity",
            entityType: "SCorp"
          },
          {
            id: "convert-llc-scorp",
            label: "Convert LLC to S Corp",
            type: "info",
            message: "Consider electing S Corp tax status for your LLC"
          }
        ]
      });
    }

    // Manager-Managed LLC Suggestion
    if (hasLLC && hasSCorp) {
      suggestions.push({
        id: "manager-managed-llc",
        message: "Here's a ninja move: Make your LLCs manager-managed with your S Corp as the manager! This way, the S Corp (you) manages the LLCs and gets paid management fees - turning passive income into active income you can deduct business expenses against. It's like having your cake and eating it too!",
        type: "optimization",
        relatedEntities: entities.filter(e => e.type === "LLC" || e.type === "SCorp").map(e => e.id),
        actions: [
          {
            id: "setup-manager-managed",
            label: "Setup Manager-Managed LLC",
            type: "info",
            message: "Consider structuring LLCs as manager-managed with S Corp as manager"
          }
        ]
      });
    }

    // Check for missing Form 1040
    const hasForm1040 = entities.some(e => e.type === "Form1040");
    
    if (entities.length >= 2 && !hasForm1040) {
      suggestions.push({
        id: "missing-form1040",
        message: "Hold up! You've got this beautiful structure, but where's your Form 1040? That's where all the tax magic happens - it's like having a symphony without a conductor. Add your personal tax return to see how everything flows together!",
        type: "warning",
        relatedEntities: [],
        actions: [
          {
            id: "add-form1040",
            label: "Add Form 1040",
            type: "create_entity",
            entityType: "Form1040"
          }
        ]
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
        relatedEntities: unconnectedEntities.map(e => e.id),
        actions: [
          {
            id: "connect-entities",
            label: "Connect Entities",
            type: "info",
            message: "Drag from one entity to another to create ownership connections"
          }
        ]
      });
    }

    // Check for proper structure progression
    if (entities.length >= 3 && connections.length >= 2) {
      suggestions.push({
        id: "great-progress",
        message: "Now we're cooking with gas! You're building a structure that would make any tax strategist proud. Don't forget to consider the state where you're forming these entities - some states are like tax havens, others are like... well, let's just say they're not. Wyoming and Nevada are my personal favorites!",
        type: "tip",
        relatedEntities: [],
        actions: [
          {
            id: "review-states",
            label: "Review Entity States",
            type: "info",
            message: "Consider Wyoming or Nevada for favorable business laws"
          }
        ]
      });
    }

    // Advanced optimization suggestions
    if (entities.length >= 4) {
      suggestions.push({
        id: "advanced-optimization",
        message: "Wow! You're in the advanced leagues now! With this many entities, you're probably ready for some ninja-level tax strategies. Consider how each entity's tax elections work together - it's like conducting a tax orchestra where every instrument needs to be in perfect harmony!",
        type: "optimization",
        relatedEntities: [],
        actions: [
          {
            id: "tax-election-review",
            label: "Review Tax Elections",
            type: "info",
            message: "Consider advanced tax election strategies for entity optimization"
          }
        ]
      });
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AIService();