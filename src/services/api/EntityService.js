import mockEntities from "@/services/mockData/entities.json";

class EntityService {
  constructor() {
    this.entities = [...mockEntities];
  }

  async getAll() {
    await this.delay(300);
    return [...this.entities];
  }

  async getById(id) {
    await this.delay(200);
    const entity = this.entities.find(e => e.Id === parseInt(id));
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return { ...entity };
  }

async create(entityData) {
    await this.delay(400);
    const entityId = this.getNextId();
    const newEntity = {
      Id: entityId,
      id: entityId.toString(),
      type: entityData.type,
      name: entityData.name,
      position: entityData.position || { x: 0, y: 0 },
      properties: entityData.properties || {},
      connections: []
    };
    this.entities.push(newEntity);
    return { ...newEntity };
  }

  async update(id, entityData) {
    await this.delay(300);
    const index = this.entities.findIndex(e => e.Id === parseInt(id) || e.id === id);
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
    this.entities[index] = { ...entityData, Id: this.entities[index].Id };
    return { ...this.entities[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.entities.findIndex(e => e.Id === parseInt(id) || e.id === id);
    if (index === -1) {
      throw new Error(`Entity with id ${id} not found`);
    }
    this.entities.splice(index, 1);
    return true;
  }

  getNextId() {
    return this.entities.length > 0 
      ? Math.max(...this.entities.map(e => e.Id || 0)) + 1 
      : 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EntityService();