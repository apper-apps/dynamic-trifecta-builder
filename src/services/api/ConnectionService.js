import mockConnections from "@/services/mockData/connections.json";

class ConnectionService {
  constructor() {
    this.connections = [...mockConnections];
  }

  async getAll() {
    await this.delay(250);
    return [...this.connections];
  }

  async getById(id) {
    await this.delay(200);
    const connection = this.connections.find(c => c.Id === parseInt(id));
    if (!connection) {
      throw new Error(`Connection with id ${id} not found`);
    }
    return { ...connection };
  }

async create(connectionData) {
    await this.delay(300);
    
    // Validate required fields
    if (!connectionData.from || !connectionData.to) {
      throw new Error("Connection requires both 'from' and 'to' entity IDs");
    }
    
    // Check for duplicate connections
    const isDuplicate = this.connections.some(c => 
      (c.from === connectionData.from && c.to === connectionData.to) ||
      (c.from === connectionData.to && c.to === connectionData.from)
    );
    
    if (isDuplicate) {
      throw new Error("Connection already exists between these entities");
    }
    
    const connectionId = this.getNextId();
    const newConnection = {
      Id: connectionId,
      id: connectionId.toString(),
      from: connectionData.from,
      to: connectionData.to,
      type: connectionData.type || "ownership",
      label: connectionData.label || "owns",
      properties: connectionData.properties || {},
      createdAt: new Date().toISOString()
    };
    
    this.connections.push(newConnection);
    return { ...newConnection };
  }

async update(id, connectionData) {
    await this.delay(250);
    const parsedId = parseInt(id);
    const index = this.connections.findIndex(c => c.Id === parsedId || c.id === id);
    if (index === -1) {
      throw new Error(`Connection with id ${id} not found`);
    }
    
    // Preserve essential fields
    const existingConnection = this.connections[index];
    this.connections[index] = { 
      ...existingConnection,
      ...connectionData, 
      Id: existingConnection.Id,
      id: existingConnection.id,
      updatedAt: new Date().toISOString()
    };
    return { ...this.connections[index] };
  }

  async delete(id) {
    await this.delay(200);
    const parsedId = parseInt(id);
    const index = this.connections.findIndex(c => c.Id === parsedId || c.id === id);
    if (index === -1) {
      throw new Error(`Connection with id ${id} not found`);
    }
    this.connections.splice(index, 1);
    return true;
  }

  getNextId() {
    return this.connections.length > 0 
      ? Math.max(...this.connections.map(c => c.Id || 0)) + 1 
      : 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ConnectionService();