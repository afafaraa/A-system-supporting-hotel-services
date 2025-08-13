export const palette = {
  light: {
    background: {
      primary: '#FAF9FB',
      secondary: '#FFFFFF',
      tetrary: '#F5EEFE',
    },
    text: {
      primary: '#000000',
      secondary: '#766F84',
      tetrary: "#FFFFFF",
    },
    primary: '#7545FB',
    secondary: '#4E378F',
    icon: '#ffffff',
    shadow: '#E6DBF5',
  }
}

class LightThemeColors {
  private colors = {
    backgroundPrimary: [250, 249, 251],
    backgroundSecondary: [255, 255, 255],
    backgroundTetrary: [245, 238, 254],
    textPrimary: [0, 0, 0],
    textSecondary: [118, 111, 132],
    textTetrary: [255, 255, 255],
    primary: [117, 69, 251],
    secondary: [78, 55, 143],
    icon: [255, 255, 255],
    shadow: [230, 219, 245],
  };

  private toRgba(rgb: number[], opacity: number) {
    return `rgba(${rgb.join(', ')}, ${opacity})`;
  }

  backgroundPrimary(opacity: number) {
    return this.toRgba(this.colors.backgroundPrimary, opacity);
  }

  backgroundSecondary(opacity: number) {
    return this.toRgba(this.colors.backgroundSecondary, opacity);
  }

  backgroundTetrary(opacity: number) {
    return this.toRgba(this.colors.backgroundTetrary, opacity);
  }

  textPrimary(opacity: number) {
    return this.toRgba(this.colors.textPrimary, opacity);
  }

  textSecondary(opacity: number) {
    return this.toRgba(this.colors.textSecondary, opacity);
  }

  textTetrary(opacity: number) {
    return this.toRgba(this.colors.textTetrary, opacity);
  }

  primary(opacity: number) {
    return this.toRgba(this.colors.primary, opacity);
  }

  secondary(opacity: number) {
    return this.toRgba(this.colors.secondary, opacity);
  }

  icon(opacity: number) {
    return this.toRgba(this.colors.icon, opacity);
  }

  shadow(opacity: number) {
    return this.toRgba(this.colors.shadow, opacity);
  }
}

export const lightColors = new LightThemeColors();
