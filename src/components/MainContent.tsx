import React, { useState, useEffect, useRef } from 'react';
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

const STIMULUS_FACTORS = "Internal States (Boredom, Hunger, Thirst, Fatigue/Restlessness, Emotional State, Curiosity, Need for Achievement, Inspiration), External Cues (Time of Day, Day of Week, Weather, Location, Social Factors, Special Occasion, Notification, Advertising, Financial Situation, Availability)";
const KNOWLEDGE_FACTORS = "Product/Service Attributes (Price, Quality, Features, Convenience, Novelty, Brand Reputation, Personal Relevance (Functional, Thematic, Identity-Based), Emotional Appeal, Time Commitment, Risk), Information Source & Presentation (Visual Presentation, Recommendation Source, Review Content/Sentiment, Rating Score/Distribution, Social Proof), User's Prior Knowledge (Past Experience, User Preferences/History)";
const EVALUATION_STYLES = "Logical, Intuitive, Impulsive, Habitual";

const CoverImage = ({ src, alt, className, placeholderIcon }: { src: string, alt: string, className?: string, placeholderIcon: string }) => {
    const [error, setError] = useState(false);

    // Reset error when src changes
    useEffect(() => {
        setError(false);
    }, [src]);

    if (error || !src) {
        return <div className="item-cover-placeholder">{placeholderIcon}</div>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export const MainContent: React.FC<MainContentProps> = ({ selectedUser }) => {
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const [simState, setSimState] = useState<SimulationState>('IDLE');


    // Track results for 3 models
    const [teacherResult, setTeacherResult] = useState<ModelResult>({ result: null, loading: false });
    const [studentResult, setStudentResult] = useState<ModelResult>({ result: null, loading: false });
    const [ftResult, setFtResult] = useState<ModelResult>({ result: null, loading: false });

    // Reset when user changes
    useEffect(() => {
        if (selectedUser) {
            timeoutRefs.current.forEach(clearTimeout);
            timeoutRefs.current = [];
            setSimState('IDLE');
            resetResults();
            // Automatically start prompt construction to mimic original flow
            startPromptConstruction();
        }
    }, [selectedUser]);

    const resetResults = () => {
        setTeacherResult({ result: null, loading: false });
        setStudentResult({ result: null, loading: false });
        setFtResult({ result: null, loading: false });
    };

    const startPromptConstruction = () => {
        setSimState('CONSTRUCTING');
        setTimeout(() => {
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
            // Teacher and Student use static outputs from mock data
            if (selectedUser.modelOutputs) {
                const outputs = selectedUser.modelOutputs;
                const t1 = setTimeout(() => {
                    setTeacherResult({ result: outputs.teacher, loading: false });
                }, 2500 + Math.random() * 2000);
                timeoutRefs.current.push(t1);

                const t2 = setTimeout(() => {
                    setStudentResult({ result: outputs.student, loading: false });
                }, 2000 + Math.random() * 2000);
                timeoutRefs.current.push(t2);
            } else {
                // Fallback to API if no static outputs available
                const [r1, r2] = await Promise.all([
                    simulate(selectedUser.history, selectedUser.exposure_list.map(i => i.title), 'Teacher Model', selectedUser.rawProfile),
                    simulate(selectedUser.history, selectedUser.exposure_list.map(i => i.title), 'Student Model', selectedUser.rawProfile)
                ]);
                setTeacherResult({ result: r1, loading: false });
                setStudentResult({ result: r2, loading: false });
            }

            // Fine-tuned model always calls API
            let ftModelResult = await simulate(
                selectedUser.history,
                selectedUser.exposure_list.map(i => i.title),
                'Fine-tuned Student',
                selectedUser.rawProfile
            );

            // Fallback to locally cached result if API fails
            if (ftModelResult.behavior === 'Error' && selectedUser.modelOutputs && selectedUser.modelOutputs['Fine-tuned_model']) {
                console.warn('Fine-tuned model API failed. Using cached output from user profile.');
                ftModelResult = selectedUser.modelOutputs['Fine-tuned_model'];
            }

            setFtResult({ result: ftModelResult, loading: false });

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
                                        <CoverImage
                                            src={item.cover || ''}
                                            alt={item.title}
                                            className="item-cover"
                                            placeholderIcon="📚"
                                        />
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
                                        <CoverImage
                                            src={item.cover || ''}
                                            alt={item.title}
                                            className="item-cover"
                                            placeholderIcon="🎬"
                                        />
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
                        <div className="prompt-display">
                            <p>You are a sophisticated user behavior emulator, tasked with simulating user responses within a general recommendation context. Given a user profile and an exposure list, generate a detailed, first-person intent statement that reflects the user's behavior. Your simulations should be adapted for diverse recommendation domains such as media, businesses, and e-commerce.</p>

                            <h4>Intent Structure and Content:</h4>
                            <p style={{ fontStyle: 'italic' }}>The intent should be structured as a logical progression through the following stages, each marked by a corresponding label:</p>

                            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                <li className="prompt-list-item">
                                    <span className="prompt-main-label">• Stimulus: </span>
                                    <span>[Describe the initial motivation or need that initiates the user's thought process. This should connect to their profile's spatial, temporal, thematic preferences, causal, and social factors.]</span>
                                    <div className="prompt-sub-list">
                                        <div className="prompt-sub-item">
                                            <span className="prompt-sub-label">– Stimulus Factors: </span>
                                            <span>[List 1-3 most relevant factors from: <span className="blue-text">{STIMULUS_FACTORS}</span>].</span>
                                        </div>
                                    </div>
                                </li>

                                <li className="prompt-list-item">
                                    <span className="prompt-main-label">• Knowledge: </span>
                                    <span>[Describe the user's thought process as they gain knowledge from the exposure list. Highlight specific attributes of the options that resonate with the user's preferences, drawing on the user profile.]</span>
                                    <div className="prompt-sub-list">
                                        <div className="prompt-sub-item">
                                            <span className="prompt-sub-label">– Knowledge Factors: </span>
                                            <span>[List 2-4 most influential factors from: <span className="blue-text">{KNOWLEDGE_FACTORS}</span>].</span>
                                        </div>
                                    </div>
                                </li>

                                <li className="prompt-list-item">
                                    <span className="prompt-main-label">• Evaluation: </span>
                                    <span>[Explain the user's internal justification for their preference.]</span>
                                    <div className="prompt-sub-list">
                                        <div className="prompt-sub-item">
                                            <span className="prompt-sub-label">– Evaluation Style: </span>
                                            <span>[Specify 1 style of the evaluation process, such as <span className="blue-text">{EVALUATION_STYLES}</span>].</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <h4>Output Format:</h4>
                            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9em' }}>
                                <div><strong>Thought:</strong></div>
                                <div>-Stimulus: [Stimulus Description]</div>
                                <div>-Stimulus Factors: [Factor 1], [Factor 2]</div>
                                <div>-Knowledge: [Knowledge Description]</div>
                                <div>-Knowledge Factors: [Factor 1], [Factor 2], [Factor 3]</div>
                                <div>-Evaluation: [Evaluation Description]</div>
                                <div>-Evaluation Style: [Evaluation Style]</div>
                                <div><strong>Behavior:</strong> [Behavior]</div>
                            </div>

                            <h4>Constraints:</h4>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                                <li>While multiple behaviors might be considered in the early stages, the final intent and decision should align with a <strong>single</strong> behavior.</li>
                                <li>The behavior can be represented by a single label from the choices in the exposure list, enclosed in square brackets (e.g., [X]).</li>
                                <li>Use "I" to reflect the first-person perspective of the user.</li>
                            </ul>

                            {/* Dynamic User Data Section */}
                            <div className="prompt-data-section">
                                <h4 className="red-text">{'User Profile'}</h4>
                                <div style={{ background: '#fff3f3', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <div>- Name: {selectedUser.name}</div>
                                    <div>- Age: {selectedUser.profile.age}</div>
                                    <div>- Gender: {selectedUser.profile.gender}</div>
                                    <div>- Occupation: {selectedUser.profile.occupation || 'N/A'}</div>
                                    <div>- Location: {selectedUser.profile.location || 'N/A'}</div>
                                    <div>- Traits: {selectedUser.profile.traits.join(', ')}</div>
                                </div>

                                <h4 className="red-text">{'Interaction History'}</h4>
                                <div style={{ background: '#fff3f3', padding: '1rem', borderRadius: '8px' }}>
                                    {selectedUser.history.map((item, i) => (
                                        <div key={i}>{i + 1}. {item.title} ({item.year}) - {item.genre}</div>
                                    ))}
                                </div>

                                <h4 className="red-text">{'Exposure List'}</h4>
                                <div style={{ background: '#fff3f3', padding: '1rem', borderRadius: '8px' }}>
                                    {selectedUser.exposure_list.map((item, i) => (
                                        <div key={i}>{String.fromCharCode(65 + i)}. {item.title} ({item.year}) - {item.genre}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
                    <div className="results-wrapper">
                        {selectedUser.groundTruth && (
                            <div className="ground-truth-section">
                                <div className="ground-truth-label">
                                    <span>🎯 Ground Truth Behavior:</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="ground-truth-details">
                                        {(() => {
                                            const index = selectedUser.groundTruth!.charCodeAt(0) - 65;
                                            const item = selectedUser.exposure_list[index];
                                            return item ? `${item.title} (${item.year})` : '';
                                        })()}
                                    </span>
                                    <span className="ground-truth-value">[{selectedUser.groundTruth}]</span>
                                </div>
                            </div>
                        )}
                        <div className="models-grid">
                            <ModelCard name={<div>Teacher Model<br />(Qwen2.5-32B-Instruct)</div>} data={teacherResult} color="#4CAF50" />
                            <ModelCard name={<div>Student Model<br />(Llama-3.2-3B-Instruct)</div>} data={studentResult} color="#2196F3" />
                            <ModelCard name={<div>Fine-tuned Student Model<br />(Llama-3.2-3B-Instruct with SFT&DPO)</div>} data={ftResult} color="#9C27B0" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ModelCard = ({ name, data, color }: { name: React.ReactNode, data: ModelResult, color: string }) => {
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
