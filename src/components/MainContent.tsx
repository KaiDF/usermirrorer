import React, { useState, useEffect } from 'react';
import type { User, SimulationResult } from '../types';
import { simulate } from '../api';
import './MainContent.css';

interface MainContentProps {
    selectedUser: User | null;
}

type SimulationState = 'IDLE' | 'CONSTRUCTING' | 'READY' | 'RUNNING' | 'COMPLETED';

interface ModelResult {
    result: SimulationResult | null;
    loading: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ selectedUser }) => {
    const [simState, setSimState] = useState<SimulationState>('IDLE');
    const [prompt, setPrompt] = useState('');

    // Track results for 3 models
    const [teacherResult, setTeacherResult] = useState<ModelResult>({ result: null, loading: false });
    const [studentResult, setStudentResult] = useState<ModelResult>({ result: null, loading: false });
    const [ftResult, setFtResult] = useState<ModelResult>({ result: null, loading: false });

    // Reset when user changes
    useEffect(() => {
        if (selectedUser) {
            setSimState('IDLE');
            setPrompt('');
            resetResults();
            // Automatically start prompt construction to mimic original flow
            startPromptConstruction(selectedUser);
        }
    }, [selectedUser]);

    const resetResults = () => {
        setTeacherResult({ result: null, loading: false });
        setStudentResult({ result: null, loading: false });
        setFtResult({ result: null, loading: false });
    };

    const startPromptConstruction = (user: User) => {
        setSimState('CONSTRUCTING');
        setTimeout(() => {
            const stimulusFactors = `Internal States (Boredom, Hunger, Thirst, Fatigue/Restlessness, Emotional State, Curiosity, Need for Achievement, Inspiration), External Cues (Time of Day, Day of Week, Weather, Location, Social Factors, Special Occasion, Notification, Advertising, Financial Situation, Availability)`;
            const knowledgeFactors = `Product/Service Attributes (Price, Quality, Features, Convenience, Novelty, Brand Reputation, Personal Relevance (Functional, Thematic, Identity-Based), Emotional Appeal, Time Commitment, Risk), Information Source & Presentation (Visual Presentation, Recommendation Source, Review Content/Sentiment, Rating Score/Distribution, Social Proof), User's Prior Knowledge (Past Experience, User Preferences/History)`;
            const evaluationStyles = `Logical, Intuitive, Impulsive, Habitual`;

            const profileStr = `User Profile:
- Name: ${user.name}
- Age: ${user.profile.age}
- Gender: ${user.profile.gender}
- Occupation: ${user.profile.occupation || 'N/A'}
- Location: ${user.profile.location || 'N/A'}
- Traits: ${user.profile.traits.join(', ')}`;

            const exposureStr = `Exposure List:
${user.exposure_list.map((item, i) => `${String.fromCharCode(65 + i)}. ${item.title} (${item.year}) - ${item.genre}`).join('\n')}`;

            const newPrompt = `You are a sophisticated user behavior emulator, tasked with simulating user responses within a general recommendation context. Given a user profile and an exposure list, generate a detailed, first-person intent statement that reflects the user's behavior. Your simulations should be adapted for diverse recommendation domains such as media, businesses, and e-commerce.

Intent Structure and Content:
The intent should be structured as a logical progression through the following stages, each marked by a corresponding label:

- Stimulus: [Describe the initial motivation or need that initiates the user's thought process. This should connect to their profile's spatial, temporal, thematic preferences, causal, and social factors.]
  - Stimulus Factors: [List 1-3 most relevant factors from: ${stimulusFactors}].

- Knowledge: [Describe the user's thought process as they gain knowledge from the exposure list. Highlight specific attributes of the options that resonate with the user's preferences, drawing on the user profile.]
  - Knowledge Factors: [List 2-4 most influential factors from: ${knowledgeFactors}].

- Evaluation: [Explain the user's internal justification for their preference.]
  - Evaluation Style: [Specify 1 style of the evaluation process, such as ${evaluationStyles}].

Output Format:
Thought:
-Stimulus: [Stimulus Description]
-Stimulus Factors: [Factor 1], [Factor 2]
-Knowledge: [Knowledge Description]
-Knowledge Factors: [Factor 1], [Factor 2], [Factor 3]
-Evaluation: [Evaluation Description]
-Evaluation Style: [Evaluation Style]
Behavior: [Behavior]

Constraints:
- While multiple behaviors might be considered in the early stages, the final intent and decision should align with a single behavior.
- The behavior can be represented by a single label from the choices in the exposure list, enclosed in square brackets (e.g., [X]).
- Use "I" to reflect the first-person perspective of the user.

${profileStr}

${exposureStr}
`;
            setPrompt(newPrompt);
            setSimState('READY');
        }, 1200);
    };

    const handleSimulate = async () => {
        if (!selectedUser) return;

        setSimState('RUNNING');

        // Start all 3 simulations
        setTeacherResult({ result: null, loading: true });
        setStudentResult({ result: null, loading: true });
        setFtResult({ result: null, loading: true });

        try {
            // Run in parallel
            const [r1, r2, r3] = await Promise.all([
                simulate(selectedUser.history, selectedUser.exposure_list.map(i => i.title), 'Teacher Model', prompt),
                simulate(selectedUser.history, selectedUser.exposure_list.map(i => i.title), 'Student Model', prompt),
                simulate(selectedUser.history, selectedUser.exposure_list.map(i => i.title), 'Fine-tuned Student', prompt)
            ]);

            setTeacherResult({ result: r1, loading: false });
            setStudentResult({ result: r2, loading: false });
            setFtResult({ result: r3, loading: false });

            setSimState('COMPLETED');
        } catch (e) {
            console.error("Simulation failed", e);
            setSimState('READY'); // Allow retry
        }
    };

    if (!selectedUser) {
        return (
            <div className="main-content">
                <div className="welcome-screen">
                    <div className="welcome-icon">👋</div>
                    <h2>Welcome to UserMirrorer</h2>
                    <p>Select a user from the sidebar to begin simulation.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="simulation-container">
                {/* User Header */}
                {/* User Header */}
                {/* User Header */}
                <div className="user-header-card">
                    <div className="profile-header-row">
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="large-avatar" />
                        <div className="user-identity">
                            <h2>{selectedUser.name}</h2>
                            <div className="profile-badges">
                                <span className="badge badge-gender">👤 {selectedUser.profile.gender}</span>
                                <span className="badge badge-age">🎂 {selectedUser.profile.age}</span>
                                {selectedUser.profile.occupation && <span className="badge badge-occupation">💼 {selectedUser.profile.occupation}</span>}
                                {selectedUser.profile.location && <span className="badge badge-location">📍 {selectedUser.profile.location}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="user-data-grid">
                        <div className="data-section history-section">
                            <h3 className="section-title">Viewing History</h3>
                            <div className="scrollable-list">
                                {selectedUser.history.map((item, index) => (
                                    <div key={index} className="history-item-card">
                                        {item.cover && <img src={item.cover} alt={item.title} className="item-cover" />}
                                        <div className="history-content">
                                            <div className="history-main">
                                                <span className="item-title">{item.title}</span>
                                                <span className="item-year">({item.year})</span>
                                            </div>
                                            <div className="history-meta">
                                                <span className="item-genre">{item.genre}</span>
                                                <span className="item-rating">
                                                    <span className="star">★</span> {item.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="data-section exposure-section">
                            <h3 className="section-title">Exposure List</h3>
                            <div className="scrollable-list">
                                {selectedUser.exposure_list.map((item, index) => (
                                    <div key={index} className="exposure-item-card">
                                        <span className="item-index">{String.fromCharCode(65 + index)}</span>
                                        {item.cover && <img src={item.cover} alt={item.title} className="item-cover" />}
                                        <div className="exposure-details">
                                            <div className="exposure-top">
                                                <span className="item-title">{item.title}</span>
                                                <span className="item-year">({item.year})</span>
                                            </div>
                                            <span className="item-genre">{item.genre}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prompt Section */}
                {(simState !== 'IDLE' && simState !== 'CONSTRUCTING') && (
                    <div className="prompt-section">
                        <h3>Simulation Prompt</h3>
                        <textarea
                            className="prompt-textarea"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={simState === 'RUNNING'}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleSimulate}
                            disabled={simState === 'RUNNING'}
                        >
                            {simState === 'RUNNING' ? 'Simulating...' : 'Run Simulation'}
                        </button>
                    </div>
                )}

                {simState === 'CONSTRUCTING' && (
                    <div className="prompt-section">
                        <div className="spinner"></div>
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Constructing prompt based on user history...</p>
                    </div>
                )}

                {/* 3 Model Grid */}
                {(simState === 'RUNNING' || simState === 'COMPLETED') && (
                    <div className="models-grid">
                        <ModelCard name="Teacher Model" data={teacherResult} color="#4CAF50" />
                        <ModelCard name="Student Model" data={studentResult} color="#2196F3" />
                        <ModelCard name="Fine-tuned Student" data={ftResult} color="#9C27B0" />
                    </div>
                )}
            </div>
        </div>
    );
};

const ModelCard = ({ name, data, color }: { name: string, data: ModelResult, color: string }) => {
    return (
        <div className="model-card" style={{ borderTopColor: color }}>
            <div className="model-header">
                {name}
                {data.loading && <span className="spinner-small" />}
            </div>
            <div className="model-body">
                {data.loading ? (
                    <div className="spinner"></div>
                ) : data.result ? (
                    <div className="result-view-compact">
                        <div className="result-section">
                            <h4>Thought</h4>
                            <div className="thought-block">
                                {/* Stimulus */}
                                <div className="thought-item">
                                    <span className="label-bold">Stimulus: </span>
                                    <span>{data.result.stimulus.text}</span>
                                    {data.result.stimulus.factors && (
                                        <div className="factors-row">
                                            <span className="label-italic-bold">Stimulus Factors: </span>
                                            <span className="factor-value">{data.result.stimulus.factors}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Knowledge */}
                                <div className="thought-item">
                                    <span className="label-bold">Knowledge: </span>
                                    <span>{data.result.knowledge.text}</span>
                                    {data.result.knowledge.factors && (
                                        <div className="factors-row">
                                            <span className="label-italic-bold">Knowledge Factors: </span>
                                            <span className="factor-value">{data.result.knowledge.factors}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Evaluation */}
                                <div className="thought-item">
                                    <span className="label-bold">Evaluation: </span>
                                    <span>{data.result.evaluation.text}</span>
                                    {data.result.evaluation.style && (
                                        <div className="factors-row">
                                            <span className="label-italic-bold">Evaluation Style: </span>
                                            <span className="factor-value">{data.result.evaluation.style}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="result-section behavior-section">
                            <span className="label-bold behavior-label">Behavior: </span>
                            <span className="behavior-value">{data.result.behavior}</span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
