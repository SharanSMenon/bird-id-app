import * as moment from "moment"

export const getTaxonData = async (speciesName) => {
    const url = `https://api.inaturalist.org/v1/taxa/autocomplete?q=${speciesName}&locale=United States`
    const response = await fetch(url);
    const data = await response.json();
    let essentialInfo = [];
    for (let item of data["results"]) {
        if ((item.rank === "species" || item.rank === "subspecies") && item !== undefined) {
            const essentialInfo_ = {
                commonName: item["english_common_name"],
                scientificName: item["name"],
                photo: item["default_photo"],
                wikipediaURL: item["wikipedia_url"],
            }
            essentialInfo.push(essentialInfo_)
            break;
        }

    }
    return essentialInfo[0];
}

export const getCommmonNames = async (top5) => {
    let top5_commmon = []
    for (let idx in top5) {
        const data = await getTaxonData(top5[idx]);
        if (data != null) {
            if (data["commonName"] != null) {
                top5_commmon.push(data.commonName);
            }
        }
    }
    return top5_commmon
}

export const checkIfSpeciesRecentlyHere = async (speciesName, position) => {
    const request = `https://api.inaturalist.org/v1/observations?acc=true&geo=true&identified=true&photos=true&verifiable=true&taxon_name=${speciesName}&d1=${moment().subtract(30, 'days').format("MM/DD/YYYY")}&lat=${position.lat}&lng=${position.lon}&radius=60&order=desc&order_by=created_at`
    const response = await fetch(request);
    const data = await response.json();
    // return data["total_results"] > 25;
    if (data["total_results"] > 22) {
        return `${speciesName} is currently in your region.`
    } else {
        return `${speciesName} has not recently been seen in your region`
    }
}
export const getObservationsOfSpecies = async (speciesName, position) => {
    const request = `https://api.inaturalist.org/v1/observations?acc=true&geo=true&identified=true&photos=true&verifiable=true&taxon_name=${speciesName}&d1=${moment().subtract(365, 'days').format("MM/DD/YYYY")}&lat=${position.lat}&lng=${position.lon}&radius=40&order=desc&order_by=created_at`
    const response = await fetch(request);
    const data = await response.json();
    return data
}

export const speciesLivesHere = (scientificName, observationData) => {
    if (observationData["total_results"] > 15) {
        return `${scientificName} lives in your area.`
    } else if (observationData["total_results"] > 2) {
        return `${scientificName} has been spotted here`
    } else {
        return `${scientificName} has not been seen here.`
    }
}

export const createObservations = (observationData) => {
    const observations = [];
    let data = observationData["results"].slice(0, 10);
    for (let idx in data) {
        const obs = data[idx]
        let date = moment(obs.observed_on).fromNow();
        let observation = {
            seenOn: `Seen ${date}`,
            location: `at ${obs.place_guess || "Unknown Location"}`
        }
        observations.push(observation);
    }
    return observations;
}