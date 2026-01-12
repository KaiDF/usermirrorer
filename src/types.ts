export interface HistoryItem {
    title: string;
    year: string;
    genre: string;
    rating: string;
    cover?: string;
    // Extended fields for Books domain
    description?: string;
    author?: string;
    publishedAt?: string;
    pages?: string;
    globalRating?: string;
    myBehavior?: string;
}

export interface ExposureItem {
    title: string;
    year: string;
    genre: string;
    cover?: string;
    // Extended fields
    label?: string;
    author?: string;
    publishedAt?: string;
    pages?: string;
    rating?: string;
}

export interface SimulationSection {
    text: string;
    factors?: string; // For Stimulus/Knowledge factors
    style?: string;   // For Evaluation style
}

export interface SimulationResult {
    stimulus: SimulationSection;
    knowledge: SimulationSection;
    evaluation: SimulationSection;
    behavior: string;
}

export interface UserModelOutputs {
    teacher: SimulationResult;
    student: SimulationResult;
    "Fine-tuned_model"?: SimulationResult;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    domain: 'Books' | 'Movie';
    rawProfile?: string; // Original raw profile text
    profile: {
        age: string | number;
        gender: string;
        occupation?: string;
        location?: string;
        traits: string[];
    };
    history: HistoryItem[];
    exposure_list: ExposureItem[];
    modelOutputs?: UserModelOutputs; // Static teacher/student outputs
    groundTruth?: string; // The actual behavior/choice of the user
}

// Note: Mock data is now loaded from /public/mock_data.json
// Use dataLoader.ts to fetch user data
