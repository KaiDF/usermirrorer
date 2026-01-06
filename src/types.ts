export interface HistoryItem {
    title: string;
    year: string;
    genre: string;
    rating: string;
    cover?: string;
}

export interface ExposureItem {
    title: string;
    year: string;
    genre: string;
    cover?: string;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    domain: 'Books' | 'Movie';
    profile: {
        age: string | number; // Changed to support ranges like "35-44"
        gender: string;
        occupation?: string;
        location?: string;
        traits: string[];
    };
    history: HistoryItem[];
    exposure_list: ExposureItem[];
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

// Mock Data
export const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Cincinnati User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cincinnati',
        domain: 'Movie',
        profile: {
            gender: 'male',
            age: '35-44',
            occupation: 'other',
            location: 'Cincinnati, OH',
            traits: ['Drama', 'Musical', 'War', 'Mystery'],
        },
        history: [
            { title: 'Pink Floyd - The Wall', year: '1982', genre: 'Drama|Musical|War', rating: '3.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTQyMjQ2MjM4Ml5BMl5BanBnXkFtZTcwNDYyNTIyMg@@._V1_SX300.jpg' },
            { title: 'My Bodyguard', year: '1980', genre: 'Drama', rating: '3.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTk2Njc2MDAwNl5BMl5BanBnXkFtZTcwMjEwMjUyMg@@._V1_SX300.jpg' },
            { title: 'Agnes of God', year: '1985', genre: 'Drama|Mystery', rating: '3.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTc5OTk2MzY3OV5BMl5BanBnXkFtZTcwNTg1ODAyMg@@._V1_SX300.jpg' },
            { title: 'Color of Money, The', year: '1986', genre: 'Drama', rating: '4.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMjA5OTg2NjM2NV5BMl5BanBnXkFtZTcwMjEwMTQyMQ@@._V1_SX300.jpg' },
            { title: 'Betrayed', year: '1988', genre: 'Drama|Thriller', rating: '3.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTI1OTkxMzgxOF5BMl5BanBnXkFtZTcwNDQ1MzU1MQ@@._V1_SX300.jpg' },
            { title: 'Radio Days', year: '1987', genre: 'Comedy|Drama', rating: '4.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTY0MzAzNjI0N15BMl5BanBnXkFtZTcwMjM1ODAyMg@@._V1_SX300.jpg' },
            { title: 'Mosquito Coast, The', year: '1986', genre: 'Drama', rating: '3.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMTY0MjI1MjY2OF5BMl5BanBnXkFtZTYwMzE3NTM5._V1_SX300.jpg' },
            { title: 'Brother from Another Planet, The', year: '1984', genre: 'Drama|Sci-Fi', rating: '4.0/5.0', cover: 'https://m.media-amazon.com/images/M/MV5BMjE3Mjg4NTQ0OF5BMl5BanBnXkFtZTcwNzY3MzYwMg@@._V1_SX300.jpg' },
        ],
        exposure_list: [
            { title: 'Psycho', year: '1998', genre: 'Crime|Horror|Thriller', cover: 'https://m.media-amazon.com/images/M/MV5AAjk2ODk1ODQtNzY1Yi00ZGEwLWJhYjktM2JhZcc2ZTY2OTBiXkEyXkFqcGc@._V1_SX300.jpg' },
            { title: 'Footloose', year: '1984', genre: 'Drama', cover: 'https://m.media-amazon.com/images/M/MV5BMTEwNzkzMjQ4NzdeQTJeQWpwZ15BbWU4MDIwODc3ODEx._V1_SX300.jpg' },
            { title: 'Resurrection Man', year: '1998', genre: 'Drama|Thriller', cover: 'https://m.media-amazon.com/images/M/MV5BMTk5NjU2MjIxM15BMl5BanBnXkFtZTcwODQyMjY2MQ@@._V1_SX300.jpg' },
            { title: 'Curtis’s Charm', year: '1995', genre: 'Comedy|Drama', cover: 'https://m.media-amazon.com/images/M/MV5BMTY5ODc0NTI5N15BMl5BanBnXkFtZTcwMjE1MTQxMQ@@._V1_SX300.jpg' },
            { title: 'Psycho II', year: '1983', genre: 'Horror|Thriller', cover: 'https://m.media-amazon.com/images/M/MV5BNTI3ZGZkMDItNzAyZi00OGJlLTlhMzEtMTc2ODExYmU5ODliXkEyXkFqcGc@._V1_SX300.jpg' },
        ],
    },
    {
        id: '2',
        name: 'Alice Reader',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        domain: 'Books',
        profile: {
            age: 28,
            gender: 'Female',
            occupation: 'Software Engineer',
            location: 'San Francisco, CA',
            traits: ['Fiction Lover', 'Mystery Enthusiast'],
        },
        history: [
            { title: 'The Great Gatsby', year: '1925', genre: 'Classic', rating: '5.0/5.0', cover: 'https://m.media-amazon.com/images/I/81af+MCATTL._AC_UF1000,1000_QL80_.jpg' },
            { title: 'Sherlock Holmes', year: '1892', genre: 'Mystery', rating: '4.5/5.0', cover: 'https://m.media-amazon.com/images/I/81-349itbfL._AC_UF1000,1000_QL80_.jpg' },
        ],
        exposure_list: [
            { title: 'Harry Potter', year: '1997', genre: 'Fantasy', cover: 'https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg' },
        ],
    },
];
