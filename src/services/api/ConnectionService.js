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
    const connectionId = this.getNextId();
    const newConnection = {
      Id: connectionId,
      id: connectionId.toString(),
      from: connectionData.from,
      to: connectionData.to,
      type: connectionData.type || "ownership",
      label: connectionData.label || "owns",
      properties: connectionData.properties || {}
    };
    this.connections.push(newConnection);
    return { ...newConnection };
  }

  async update(id, connectionData) {
    await this.delay(250);
    const index = this.connections.findIndex(c => c.Id === parseInt(id) || c.id === id);
    if (index === -1) {
      throw new Error(`Connection with id ${id} not found`);
    }
    this.connections[index] = { ...connectionData, Id: this.connections[index].Id };
    return { ...this.connections[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.connections.findIndex(c => c.Id === parseInt(id) || c.id === id);
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