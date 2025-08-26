// Name generation service for Strava activities
class NameGenerator {
  constructor() {
    this.nameStyles = {
      funny: this.generateFunnyName.bind(this),
      hardWork: this.generateHardWorkName.bind(this),
      serious: this.generateSeriousName.bind(this),
      descriptive: this.generateDescriptiveName.bind(this)
    };
  }

  // Generate name based on style and activity data
  generateName(activity, style) {
    const generator = this.nameStyles[style] || this.nameStyles.descriptive;
    return generator(activity);
  }

  // Generate funny/creative names
  generateFunnyName(activity) {
    const { type, distance, moving_time, total_elevation_gain } = activity;
    const distanceKm = (distance / 1000).toFixed(1);
    const timeHours = (moving_time / 3600).toFixed(1);
    const elevationM = Math.round(total_elevation_gain);

    const funnyTemplates = [
      `🏃‍♂️ ${type} like a caffeinated cheetah`,
      `🚴‍♀️ ${type} - because walking is too mainstream`,
      `🏊‍♂️ ${type} like a fish with a fitness goal`,
      `🏃‍♀️ ${type} - ${distanceKm}km of pure determination`,
      `🚴‍♂️ ${type} up hills like a mountain goat`,
      `🏊‍♀️ ${type} - ${timeHours}h of water therapy`,
      `🏃‍♂️ ${type} - ${elevationM}m of elevation gain (ouch!)`,
      `🚴‍♀️ ${type} - because cars are overrated`,
      `🏊‍♂️ ${type} - ${distanceKm}km of liquid courage`,
      `🏃‍♀️ ${type} - ${timeHours}h of me time`
    ];

    return this.getRandomTemplate(funnyTemplates);
  }

  // Generate hard work/motivational names
  generateHardWorkName(activity) {
    const { type, distance, moving_time, total_elevation_gain } = activity;
    const distanceKm = (distance / 1000).toFixed(1);
    const timeHours = (moving_time / 3600).toFixed(1);
    const elevationM = Math.round(total_elevation_gain);

    const hardWorkTemplates = [
      `💪 ${type} - ${distanceKm}km of pure grit`,
      `🔥 ${type} - ${timeHours}h of determination`,
      `⚡ ${type} - ${elevationM}m of elevation conquered`,
      `💯 ${type} - pushing limits, breaking barriers`,
      `🚀 ${type} - ${distanceKm}km of excellence`,
      `🏆 ${type} - ${timeHours}h of commitment`,
      `💎 ${type} - ${elevationM}m of strength`,
      `🌟 ${type} - ${distanceKm}km of achievement`,
      `⚔️ ${type} - ${timeHours}h of warrior spirit`,
      `🎯 ${type} - ${elevationM}m of perseverance`
    ];

    return this.getRandomTemplate(hardWorkTemplates);
  }

  // Generate serious/professional names
  generateSeriousName(activity) {
    const { type, distance, moving_time, total_elevation_gain, start_date } = activity;
    const distanceKm = (distance / 1000).toFixed(1);
    const timeHours = (moving_time / 3600).toFixed(1);
    const elevationM = Math.round(total_elevation_gain);
    const date = new Date(start_date).toLocaleDateString();

    const seriousTemplates = [
      `${type} - ${distanceKm}km | ${timeHours}h | ${elevationM}m`,
      `${type} Training - ${date}`,
      `${type} Session - ${distanceKm}km Distance`,
      `${type} Workout - ${timeHours}h Duration`,
      `${type} - ${distanceKm}km | ${elevationM}m Elevation`,
      `${type} - ${date} | ${distanceKm}km`,
      `${type} - ${timeHours}h | ${elevationM}m`,
      `${type} - ${distanceKm}km Distance Training`,
      `${type} - ${date} | ${timeHours}h`,
      `${type} - ${elevationM}m Elevation Training`
    ];

    return this.getRandomTemplate(seriousTemplates);
  }

  // Generate descriptive names
  generateDescriptiveName(activity) {
    const { type, distance, moving_time, total_elevation_gain, start_date } = activity;
    const distanceKm = (distance / 1000).toFixed(1);
    const timeHours = (moving_time / 3600).toFixed(1);
    const elevationM = Math.round(total_elevation_gain);
    const date = new Date(start_date).toLocaleDateString();

    const descriptiveTemplates = [
      `${type} - ${distanceKm}km in ${timeHours}h`,
      `${type} with ${elevationM}m elevation gain`,
      `${distanceKm}km ${type} on ${date}`,
      `${type} - ${timeHours}h, ${distanceKm}km, ${elevationM}m`,
      `${type} session - ${distanceKm}km distance`,
      `${type} workout - ${timeHours}h duration`,
      `${type} - ${distanceKm}km route`,
      `${type} - ${elevationM}m climbing`,
      `${type} - ${date} training`,
      `${type} - ${distanceKm}km endurance`
    ];

    return this.getRandomTemplate(descriptiveTemplates);
  }

  // Get random template from array
  getRandomTemplate(templates) {
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  // Get available name styles
  getAvailableStyles() {
    return Object.keys(this.nameStyles);
  }
}

export default new NameGenerator();
