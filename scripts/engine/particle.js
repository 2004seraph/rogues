"use strict";
var particleSystems = {}

function updateParticleSystems() {
  for (let part in particleSystems) {
    particleSystems[part].update()
  }
}

function clearParticleSystems() {
  particleSystems = {}
}

class Particle {
  constructor(x, y, particleData={}) {
    this.pos = {
      x: x,
      y: y
    }

    if (particleData.hasOwnProperty("displayFunction") == false) {
      particleData.displayFunction = function() {}
    }
    if (particleData.hasOwnProperty("updateFunction") == false) {
      particleData.updateFunction = function() {}
    }
    if (particleData.hasOwnProperty("destroyFunction") == false) {
      particleData.destroyFunction = function() {return false}
    }
    if (particleData.hasOwnProperty("parameters") == false) {
      particleData.parameters = {}
    }

    this.displayFunction = particleData.displayFunction
    this.updateFunction = particleData.updateFunction
    this.destroyFunction = particleData.destroyFunction
    this.parameters = particleData.parameters
  }

  update(worldPosition) {
    this.displayFunction(worldPosition)
    this.updateFunction(worldPosition)
  }
}

class ParticleSystem {
  constructor(x, y) {
    this.pos = {
      x: x,
      y: y
    }

    this.particles = []

    this.state = true
  }

  update() {
    if (this.state) {
      for (let p = this.particles.length - 1; p > -1; p--) {
        this.particles[p].update(this.pos)
        if (this.particles[p].destroyFunction()) {
          this.particles.splice(p, 1)
        }
      }
    }
  }

  addParticle(x, y, data) {
    this.particles.push(new Particle(x, y, data))
  }
}