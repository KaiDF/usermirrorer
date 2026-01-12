/**
 * Data Loader Utilities
 * Load and manage mock data from static JSON file
 */

import type { User, SimulationResult, HistoryItem, ExposureItem } from '../types';

export interface RawHistoryItem {
    title: string;
    year: string;
    genre: string;
    rating: string;
    description?: string;
    author?: string;
    publishedAt?: string;
    pages?: string;
    globalRating?: string;
    myBehavior?: string;
    cover?: string;
}

export interface RawExposureItem {
    label?: string;
    title: string;
    year: string;
    genre: string;
    author?: string;
    publishedAt?: string;
    pages?: string;
    rating?: string;
    cover?: string;
}

export interface UserModelOutputs {
    teacher: SimulationResult;
    student: SimulationResult;
    "Fine-tuned_model"?: SimulationResult;
}

export interface RawUser {
    id: string;
    name: string;
    avatar: string;
    domain: 'Books' | 'Movie';
    rawProfile?: string;
    profile: {
        gender: string;
        age: string | number;
        occupation?: string;
        location?: string;
        traits: string[];
    };
    history: RawHistoryItem[];
    exposureList: RawExposureItem[];
    modelOutputs?: UserModelOutputs;
    groundTruth?: string;
}

export interface MockData {
    domains: {
        [key: string]: {
            users: RawUser[];
        };
    };
}

let cachedData: MockData | null = null;

/**
 * Load mock data from static JSON file
 */
export async function loadMockData(): Promise<MockData> {
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch('/mock_data.json');
        if (!response.ok) {
            throw new Error(`Failed to load mock data: ${response.statusText}`);
        }
        cachedData = await response.json();
        return cachedData!;
    } catch (error) {
        console.error('Error loading mock data:', error);
        throw error;
    }
}

/**
 * Convert RawUser to User type used by components
 */
function convertToUser(rawUser: RawUser): User {
    const history: HistoryItem[] = rawUser.history.map(h => ({
        title: h.title,
        year: h.year,
        genre: h.genre,
        rating: h.rating,
        cover: h.cover,
        description: h.description,
        author: h.author,
        publishedAt: h.publishedAt,
        pages: h.pages,
        globalRating: h.globalRating,
        myBehavior: h.myBehavior
    }));

    const exposure_list: ExposureItem[] = rawUser.exposureList.map(e => ({
        label: e.label,
        title: e.title,
        year: e.year,
        genre: e.genre,
        cover: e.cover,
        author: e.author,
        publishedAt: e.publishedAt,
        pages: e.pages,
        rating: e.rating
    }));

    return {
        id: rawUser.id,
        name: rawUser.name,
        avatar: rawUser.avatar,
        domain: rawUser.domain,
        rawProfile: rawUser.rawProfile,
        profile: rawUser.profile,
        history,
        exposure_list,
        modelOutputs: rawUser.modelOutputs,
        groundTruth: rawUser.groundTruth
    };
}

/**
 * Get all users across all domains
 */
export async function getAllUsers(): Promise<User[]> {
    const data = await loadMockData();
    const users: User[] = [];

    for (const domainKey of Object.keys(data.domains)) {
        const domainUsers = data.domains[domainKey].users;
        users.push(...domainUsers.map(convertToUser));
    }

    return users;
}

/**
 * Get users by domain
 */
export async function getUsersByDomain(domain: 'Books' | 'Movie'): Promise<User[]> {
    const data = await loadMockData();
    const domainData = data.domains[domain];

    if (!domainData) {
        return [];
    }

    return domainData.users.map(convertToUser);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
    const users = await getAllUsers();
    return users.find(u => u.id === id) || null;
}

/**
 * Get available domains
 */
export async function getAvailableDomains(): Promise<string[]> {
    const data = await loadMockData();
    return Object.keys(data.domains);
}

/**
 * Get model outputs for a user (teacher and student are static, fine-tuned is dynamic)
 */
export function getStaticModelOutputs(user: User): UserModelOutputs | undefined {
    return user.modelOutputs;
}
