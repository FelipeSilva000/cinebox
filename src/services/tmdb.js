const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Mock Data for fallback mode when no TMDB API Key is configured
const MOCK_HIGHLIGHTS = [
  {
    id: 'mock-1',
    title: 'Avengers: Doomsday',
    overview: 'Victor von Doom retorna em uma nova era de devastação multiversal. Os heróis mais poderosos da Terra devem se reunir mais uma vez para enfrentar a ameaça definitiva de destruição total.',
    release_date: '2026-05-01',
    poster_path: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=500&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    vote_average: 9.2,
    vote_count: 1540,
    type: 'movie',
    genres: ['Ação', 'Ficção Científica', 'Aventura']
  },
  {
    id: 'mock-2',
    title: 'The Batman - Part II',
    overview: 'Bruce Wayne se aprofunda ainda mais nas sombras de Gotham City, enfrentando novas conspirações no submundo criminoso e testando seus limites como detetive e protetor da cidade.',
    release_date: '2026-10-02',
    poster_path: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    vote_average: 8.9,
    vote_count: 850,
    type: 'movie',
    genres: ['Ação', 'Suspense', 'Drama']
  },
  {
    id: 'mock-3',
    title: 'Project Hail Mary',
    overview: 'Ryland Grace é o único sobrevivente em uma missão desesperada para salvar a humanidade. Desprovido de suas memórias, ele deve usar a ciência e um aliado inesperado para evitar a extinção solar.',
    release_date: '2026-03-20',
    poster_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80',
    backdrop_path: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    vote_average: 8.7,
    vote_count: 420,
    type: 'movie',
    genres: ['Ficção Científica', 'Drama', 'Aventura']
  }
];

const MOCK_CATEGORIES = {
  action: [
    { id: 'mock-a1', title: 'Avengers: Doomsday', release_date: '2026', poster_path: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=500&q=80', vote_average: 9.2, type: 'movie' },
    { id: 'mock-a2', title: 'The Batman - Part II', release_date: '2026', poster_path: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80', vote_average: 8.9, type: 'movie' },
    { id: 'mock-a3', title: 'Spider-Man: Beyond the Spider-Verse', release_date: '2026', poster_path: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=500&q=80', vote_average: 9.0, type: 'movie' },
    { id: 'mock-a4', title: 'John Wick: Capítulo 5', release_date: '2026', poster_path: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' },
    { id: 'mock-a5', title: 'Gladiador II', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=500&q=80', vote_average: 7.8, type: 'movie' },
    { id: 'mock-a6', title: 'Deadpool & Wolverine', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-a7', title: 'Furiosa: Saga Mad Max', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', vote_average: 7.9, type: 'movie' },
    { id: 'mock-a8', title: 'Duna: Parte Dois', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' },
    { id: 'mock-a9', title: 'Top Gun: Maverick', release_date: '2022', poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', vote_average: 8.3, type: 'movie' },
    { id: 'mock-a10', title: 'Homem-Aranha: Sem Volta Para Casa', release_date: '2021', poster_path: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=500&q=80', vote_average: 8.2, type: 'movie' },
    { id: 'mock-a11', title: 'Mad Max: Estrada da Fúria', release_date: '2015', poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', vote_average: 8.1, type: 'movie' },
    { id: 'mock-a12', title: 'Batman: O Cavaleiro das Trevas', release_date: '2008', poster_path: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=500&q=80', vote_average: 9.0, type: 'movie' },
    { id: 'mock-a13', title: 'A Origem', release_date: '2010', poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', vote_average: 8.8, type: 'movie' },
    { id: 'mock-a14', title: 'Kill Bill: Volume 1', release_date: '2003', poster_path: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-a15', title: 'Matrix', release_date: '1999', poster_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80', vote_average: 8.7, type: 'movie' }
  ],
  suspense: [
    { id: 'mock-s1', title: 'Nosferatu', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.2, type: 'movie' },
    { id: 'mock-s2', title: 'Trap: O Trapaceiro', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', vote_average: 7.1, type: 'movie' },
    { id: 'mock-s3', title: 'Um Lugar Silencioso: Dia Um', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', vote_average: 7.4, type: 'movie' },
    { id: 'mock-s4', title: 'Ilha do Medo', release_date: '2010', poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-s5', title: 'Se7en: Os Sete Crimes Capitais', release_date: '1995', poster_path: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=500&q=80', vote_average: 8.6, type: 'movie' },
    { id: 'mock-s6', title: 'Zodíaco', release_date: '2007', poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80', vote_average: 7.8, type: 'movie' },
    { id: 'mock-s7', title: 'Garota Exemplar', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.1, type: 'movie' },
    { id: 'mock-s8', title: 'Os Suspeitos', release_date: '2013', poster_path: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-s9', title: 'O Silêncio dos Inocentes', release_date: '1991', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.6, type: 'movie' },
    { id: 'mock-s10', title: 'Cisne Negro', release_date: '2010', poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', vote_average: 8.0, type: 'movie' },
    { id: 'mock-s11', title: 'O Abutre', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80', vote_average: 7.9, type: 'movie' },
    { id: 'mock-s12', title: 'Corra!', release_date: '2017', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 7.7, type: 'movie' },
    { id: 'mock-s13', title: 'Parasita', release_date: '2019', poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' },
    { id: 'mock-s14', title: 'Amnésia', release_date: '2000', poster_path: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-s15', title: 'Psicose', release_date: '1960', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.6, type: 'movie' }
  ],
  drama: [
    { id: 'mock-d1', title: 'Oppenheimer', release_date: '2023', poster_path: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80', vote_average: 8.9, type: 'movie' },
    { id: 'mock-d2', title: 'Vidas Passadas', release_date: '2023', poster_path: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=80', vote_average: 8.0, type: 'movie' },
    { id: 'mock-d3', title: 'Interestelar', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80', vote_average: 8.7, type: 'movie' },
    { id: 'mock-d4', title: 'A Baleia', release_date: '2022', poster_path: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80', vote_average: 8.1, type: 'movie' },
    { id: 'mock-d5', title: 'Forrest Gump', release_date: '1994', poster_path: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80', vote_average: 8.8, type: 'movie' },
    { id: 'mock-d6', title: 'Um Sonho de Liberdade', release_date: '1994', poster_path: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80', vote_average: 9.3, type: 'movie' },
    { id: 'mock-d7', title: 'O Poderoso Chefão', release_date: '1972', poster_path: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80', vote_average: 9.2, type: 'movie' },
    { id: 'mock-d8', title: 'Clube da Luta', release_date: '1999', poster_path: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=80', vote_average: 8.8, type: 'movie' },
    { id: 'mock-d9', title: 'Whiplash: Em Busca da Perfeição', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-d10', title: 'À Espera de um Milagre', release_date: '1999', poster_path: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80', vote_average: 8.9, type: 'movie' },
    { id: 'mock-d11', title: 'O Show de Truman', release_date: '1998', poster_path: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-d12', title: 'Roma', release_date: '2018', poster_path: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=80', vote_average: 7.7, type: 'movie' },
    { id: 'mock-d13', title: 'La La Land: Cantando Estações', release_date: '2016', poster_path: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80', vote_average: 7.9, type: 'movie' },
    { id: 'mock-d14', title: 'Aftersun', release_date: '2022', poster_path: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80', vote_average: 7.8, type: 'movie' },
    { id: 'mock-d15', title: 'O Homem Elefante', release_date: '1980', poster_path: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' }
  ],
  scifi: [
    { id: 'mock-sf1', title: 'Project Hail Mary', release_date: '2026', poster_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80', vote_average: 8.7, type: 'movie' },
    { id: 'mock-sf2', title: 'Duna: Parte Dois', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' },
    { id: 'mock-sf3', title: 'Avatar: Fogo e Cinzas', release_date: '2025', poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', vote_average: 8.2, type: 'movie' },
    { id: 'mock-sf4', title: 'Blade Runner 2049', release_date: '2017', poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80', vote_average: 8.3, type: 'movie' },
    { id: 'mock-sf5', title: 'Matrix', release_date: '1999', poster_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80', vote_average: 8.7, type: 'movie' },
    { id: 'mock-sf6', title: 'Interestelar', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80', vote_average: 8.7, type: 'movie' },
    { id: 'mock-sf7', title: 'A Chegada', release_date: '2016', poster_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80', vote_average: 8.1, type: 'movie' },
    { id: 'mock-sf8', title: 'Tenet', release_date: '2020', poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80', vote_average: 7.5, type: 'movie' },
    { id: 'mock-sf9', title: 'Ex Machina: Instinto Artificial', release_date: '2014', poster_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80', vote_average: 7.7, type: 'movie' },
    { id: 'mock-sf10', title: 'Tudo em Todo o Lugar ao Mesmo Tempo', release_date: '2022', poster_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=500&q=80', vote_average: 7.9, type: 'movie' },
    { id: 'mock-sf11', title: 'Gravidade', release_date: '2013', poster_path: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80', vote_average: 7.7, type: 'movie' },
    { id: 'mock-sf12', title: 'Perdido em Marte', release_date: '2015', poster_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80', vote_average: 8.0, type: 'movie' },
    { id: 'mock-sf13', title: 'Jurassic Park: O Parque dos Dinossauros', release_date: '1993', poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80', vote_average: 8.2, type: 'movie' },
    { id: 'mock-sf14', title: 'Alien, o Oitavo Passageiro', release_date: '1979', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.5, type: 'movie' },
    { id: 'mock-sf15', title: '2001: Uma Odisséia no Espaço', release_date: '1968', poster_path: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=500&q=80', vote_average: 8.3, type: 'movie' }
  ],
  comedy: [
    { id: 'mock-c1', title: 'Deadpool & Wolverine', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?auto=format&fit=crop&w=500&q=80', vote_average: 8.4, type: 'movie' },
    { id: 'mock-c2', title: 'Meu Malvado Favorito 4', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80', vote_average: 7.9, type: 'movie' },
    { id: 'mock-c3', title: 'Se Beber, Não Case!', release_date: '2009', poster_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80', vote_average: 7.7, type: 'movie' }
  ],
  horror: [
    { id: 'mock-h1', title: 'Nosferatu', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 8.2, type: 'movie' },
    { id: 'mock-h2', title: 'Um Lugar Silencioso: Dia Um', release_date: '2024', poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80', vote_average: 7.4, type: 'movie' },
    { id: 'mock-h3', title: 'Invocação do Mal', release_date: '2013', poster_path: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80', vote_average: 7.5, type: 'movie' }
  ],
  romance: [
    { id: 'mock-r1', title: 'Vidas Passadas', release_date: '2023', poster_path: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=500&q=80', vote_average: 8.0, type: 'movie' },
    { id: 'mock-r2', title: 'Como Eu Era Antes de Você', release_date: '2016', poster_path: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80', vote_average: 7.4, type: 'movie' },
    { id: 'mock-r3', title: 'Questão de Tempo', release_date: '2013', poster_path: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80', vote_average: 7.8, type: 'movie' }
  ]
};

// Search mock catalog dynamically
const searchMock = (query) => {
  const allMovies = [
    ...MOCK_HIGHLIGHTS,
    ...Object.values(MOCK_CATEGORIES).flat()
  ];
  
  // Remove duplicates by ID
  const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.id, item])).values());
  
  return uniqueMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

// Exported Functions
export const fetchHighlights = async (apiKey) => {
  if (!apiKey) {
    return MOCK_HIGHLIGHTS;
  }

  try {
    // TMDB discover endpoint for movies releasing in 2026
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${apiKey}&language=pt-BR&sort_by=popularity.desc&primary_release_year=2026&include_adult=false`
    );
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    
    // Map items to match format
    return data.results.slice(0, 3).map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview || 'Sem sinopse disponível.',
      release_date: m.release_date,
      poster_path: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80',
      backdrop_path: m.backdrop_path ? `${BACKDROP_BASE_URL}${m.backdrop_path}` : 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      vote_average: m.vote_average,
      vote_count: m.vote_count,
      type: 'movie'
    }));
  } catch (error) {
    console.error('Erro ao carregar TMDB, usando fallback mock:', error);
    return MOCK_HIGHLIGHTS;
  }
};

export const fetchMoviesByCategory = async (categoryKey, apiKey) => {
  if (!apiKey) {
    return MOCK_CATEGORIES[categoryKey] || [];
  }

  // TMDB Genre IDs mapping
  const GENRES = {
    action: 28,
    suspense: 53, // Thriller
    drama: 18,
    scifi: 878,
    comedy: 35,
    horror: 27,
    romance: 10749
  };

  const genreId = GENRES[categoryKey];
  if (!genreId) return [];

  try {
    // Fetch up to 20 movies to support carousels of size 15-20
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${apiKey}&language=pt-BR&sort_by=popularity.desc&with_genres=${genreId}&include_adult=false`
    );
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();

    return data.results.slice(0, 20).map(m => ({
      id: m.id,
      title: m.title,
      release_date: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
      poster_path: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80',
      vote_average: m.vote_average,
      type: 'movie'
    }));
  } catch (error) {
    console.error(`Erro ao carregar gênero ${categoryKey} do TMDB, usando mock:`, error);
    return MOCK_CATEGORIES[categoryKey] || [];
  }
};

export const searchCatalog = async (query, apiKey) => {
  if (!query) return [];
  
  if (!apiKey) {
    return searchMock(query);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&include_adult=false`
    );
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();

    // Filter to only movies and series and format
    return data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(m => ({
        id: m.id,
        title: m.title || m.name,
        release_date: m.release_date || m.first_air_date ? (m.release_date || m.first_air_date).substring(0, 4) : 'N/A',
        poster_path: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80',
        vote_average: m.vote_average || 0,
        type: m.media_type === 'tv' ? 'series' : 'movie',
        overview: m.overview || 'Sem sinopse disponível.'
      }));
  } catch (error) {
    console.error('Erro ao buscar no TMDB, usando fallback mock:', error);
    return searchMock(query);
  }
};
