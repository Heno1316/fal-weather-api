export default class WeatherUtils {
    static getLocationName({ name, state, country }): string {
        let location: string = name;
        if (state) {
            location += `,${state}`;
        }
        if (country) {
            location += `,${country}`;
        }

        return location;
    }
}
