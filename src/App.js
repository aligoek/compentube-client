import React, { useState, useEffect, useContext, createContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Spinner, Alert, Row, Col, Dropdown, ButtonGroup, Image, Nav, Navbar, Tooltip, OverlayTrigger, ListGroup, DropdownButton } from 'react-bootstrap';
import { Youtube, FileText, Link as LinkIcon, Globe, List, SunFill, MoonFill, BoxArrowRight, Google, GearFill, ClockHistory, PersonCircle, Trash } from 'react-bootstrap-icons';
import ReactMarkdown from 'react-markdown';

// --- Configuration ---
const BACKEND_URL = 'http://localhost:5000'; // Ensure this is your backend server URL
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Your Google Client ID from .env

// --- Internationalization (i18n) ---
const translations = {
    en: {
        // Header
        history: 'History',
        settings: 'Settings',
        logout: 'Logout',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signedInAs: 'Signed in as',
        // Home Page
        youtubeLink: 'YouTube Video Link',
        pasteLink: 'Paste a YouTube link here...',
        language: 'Language',
        summaryLength: 'Length',
        short: 'Short',
        detailed: 'Detailed',
        generateSummary: 'Generate Summary',
        signInToGetStarted: 'Sign in to get started',
        summaryError: 'Please sign in to generate a summary.',
        linkError: 'Please paste a YouTube link first.',
        fetchingTranscript: 'Fetching transcript and generating summary...',
        generatedSummary: 'Generated Summary',
        // Settings Page
        theme: 'Theme',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        interfaceLanguage: 'Interface Language',
        // History Page
        summaryHistory: 'Summary History',
        noHistory: 'You have no saved summaries.',
        viewOnYouTube: 'View on YouTube',
        delete: 'Delete',
        // Auth Redirect
        accessDenied: 'Access Denied',
        loginToAccess: 'Please log in to access this page.',
        signInToContinue: 'Sign In to Continue',
    },
    tr: {
        // Header
        history: 'Geçmiş',
        settings: 'Ayarlar',
        logout: 'Çıkış Yap',
        signIn: 'Giriş Yap',
        signUp: 'Kayıt Ol',
        signedInAs: 'Giriş yapan kullanıcı',
        // Home Page
        youtubeLink: 'YouTube Video Bağlantısı',
        pasteLink: 'Buraya bir YouTube bağlantısı yapıştırın...',
        language: 'Dil',
        summaryLength: 'Uzunluk',
        short: 'Kısa',
        detailed: 'Detaylı',
        generateSummary: 'Özet Oluştur',
        signInToGetStarted: 'Başlamak için giriş yapın',
        summaryError: 'Özet oluşturmak için lütfen giriş yapın.',
        linkError: 'Lütfen önce bir YouTube bağlantısı yapıştırın.',
        fetchingTranscript: 'Transkript alınıyor ve özet oluşturuluyor...',
        generatedSummary: 'Oluşturulan Özet',
        // Settings Page
        theme: 'Tema',
        lightMode: 'Açık Mod',
        darkMode: 'Karanlık Mod',
        interfaceLanguage: 'Arayüz Dili',
        // History Page
        summaryHistory: 'Özet Geçmişi',
        noHistory: 'Kaydedilmiş özetiniz bulunmamaktadır.',
        viewOnYouTube: 'YouTube\'da Görüntüle',
        delete: 'Sil',
        // Auth Redirect
        accessDenied: 'Erişim Engellendi',
        loginToAccess: 'Bu sayfaya erişmek için lütfen giriş yapın.',
        signInToContinue: 'Devam Etmek İçin Giriş Yap',
    }
};

const LanguageContext = createContext();

function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// --- Main App Component ---
function App() {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center text-center bg-light">
                <Alert variant="danger" className="shadow-lg">
                    <Alert.Heading>Configuration Error</Alert.Heading>
                    <p>The Google Client ID is missing. Please set <code>REACT_APP_GOOGLE_CLIENT_ID</code> in your <code>.env</code> file.</p>
                </Alert>
            </div>
        );
    }
    return (
        <LanguageProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap');
                    body {
                        font-family: 'IBM Plex Sans', sans-serif;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'IBM Plex Sans', sans-serif;
                        font-weight: 700; /* Bold for headings */
                    }
                    .card, .form-control, .btn, .dropdown-menu, .list-group-item {
                        border-radius: 0.75rem !important; /* More rounded corners */
                        border-width: 1px !important; /* Thinner borders */
                    }
                    .card {
                        border-color: var(--bs-border-color-translucent) !important; /* Subtle border color */
                    }
                    .form-control:focus {
                        border-color: var(--bs-primary) !important;
                        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), .25) !important;
                    }
                    .btn-primary {
                        border-color: var(--bs-primary) !important;
                    }
                    .btn-outline-secondary {
                        border-color: var(--bs-secondary) !important;
                    }
                    .btn-outline-danger {
                        border-color: var(--bs-danger) !important;
                    }
                    .btn-link {
                        border: none !important; /* Remove border for link buttons */
                    }
                    .border-top {
                        border-color: var(--bs-border-color-translucent) !important;
                    }
                    .shadow-sm {
                        box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
                    }
                    .dark-theme .shadow-sm {
                        box-shadow: 0 .125rem .25rem rgba(255,255,255,.075)!important;
                    }
                    `}
                </style>
                <CompentubeApp />
            </GoogleOAuthProvider>
        </LanguageProvider>
    );
}

// --- Core Application Logic and Routing ---
function CompentubeApp() {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setAuthLoading] = useState(true);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [currentPage, setCurrentPage] = useState('home');
    const [summary, setSummary] = useState(''); // Added state for summary
    const [videoDetails, setVideoDetails] = useState(null); // Added state for videoDetails

    // const { t } = useContext(LanguageContext);

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/status`, { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    if (data.loggedIn) setUser(data.user);
                }
            } catch (error) {
                console.error("Could not verify auth status:", error);
            } finally {
                setAuthLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const handleGoogleLogin = () => {
        const redirectUri = `${BACKEND_URL}/api/auth/google/callback`;
        const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/generative-language.retriever');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    };

    const handleLogout = async () => {
        await fetch(`${BACKEND_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        setUser(null);
        setCurrentPage('home');
        setSummary(''); // Clear summary on logout
        setVideoDetails(null); // Clear video details on logout
    };

    const handleNavigateAndClearSummary = (page) => {
        setCurrentPage(page);
        setSummary(''); // Clear summary on navigation to home
        setVideoDetails(null); // Clear video details on navigation to home
    };

    if (isAuthLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <AppHeader
                user={user}
                onLogin={handleGoogleLogin}
                onLogout={handleLogout}
                onNavigate={handleNavigateAndClearSummary} // Use the new handler
                theme={theme}
                toggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
            />
            <main className="flex-grow-1 py-4 py-md-5">
                <PageContent
                    page={currentPage}
                    user={user}
                    theme={theme}
                    setTheme={setTheme}
                    onLogin={handleGoogleLogin}
                    summary={summary} // Pass summary state
                    setSummary={setSummary} // Pass setSummary function
                    videoDetails={videoDetails} // Pass videoDetails state
                    setVideoDetails={setVideoDetails} // Pass setVideoDetails function
                />
            </main>
            <AppFooter theme={theme} /> {/* Pass theme to footer */}
        </div>
    );
}

// --- Header Component ---
function AppHeader({ user, onLogin, onLogout, onNavigate, theme, toggleTheme }) {
    const { t } = useContext(LanguageContext);
    const navLinkClasses = "fw-medium";

    return (
        <div className={theme === 'dark' ? 'bg-dark' : 'bg-light'} style={{borderBottom: '1px solid var(--bs-border-color-translucent)'}}>
            <Container>
                <Navbar bg={theme} variant={theme} expand="lg" className="shadow-none">
                    <Navbar.Brand href="#" onClick={() => onNavigate('home')} className="d-flex align-items-center fw-bold">
                        <Youtube color="#FF0000" size={30} className="me-2" />
                        Compentube
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            {user ? (
                                <>
                                    <Nav.Link onClick={() => onNavigate('history')} className={navLinkClasses}><ClockHistory className="me-1" /> {t('history')}</Nav.Link>
                                    {/* Swapped position of theme toggle and user profile dropdown */}
                                    <Button variant="link" onClick={toggleTheme} className="ms-2 text-secondary">
                                        {theme === 'dark' ? <SunFill size={20} /> : <MoonFill size={20} />}
                                    </Button>
                                    <Dropdown as={Nav.Item}>
                                        <Dropdown.Toggle as={Nav.Link} className="d-flex align-items-center" bsPrefix="p-0 ms-3">
                                            <Image 
                                                src={user.picture} 
                                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/6c757d/white?text=U' }}
                                                roundedCircle 
                                                width="40" 
                                                height="40" 
                                                alt={user.name} 
                                                style={{border: '1px solid var(--bs-primary)', borderRadius: '50%'}}
                                            />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Header>{t('signedInAs')}<br /><strong>{user.name}</strong></Dropdown.Header>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={() => onNavigate('settings')}><GearFill className="me-2" /> {t('settings')}</Dropdown.Item>
                                            <Dropdown.Item onClick={onLogout}><BoxArrowRight className="me-2" /> {t('logout')}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            ) : (
                                <>
                                    {/* Theme toggle button to the left */}
                                    <Button variant="link" onClick={toggleTheme} className="me-2 text-secondary">
                                        {theme === 'dark' ? <SunFill size={20} /> : <MoonFill size={20} />}
                                    </Button>
                                    <Button variant="outline-primary" className="me-2" onClick={onLogin}>{t('signIn')}</Button>
                                    <Button variant="primary" onClick={onLogin}>{t('signUp')}</Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    );
}

// --- Page Content Router ---
function PageContent({ page, user, theme, setTheme, onLogin, summary, setSummary, videoDetails, setVideoDetails }) {
    switch (page) {
        case 'settings':
            return user ? <SettingsPage theme={theme} setTheme={setTheme} /> : <AuthRedirect onLogin={onLogin} />;
        case 'history':
            return user ? <HistoryPage user={user} /> : <AuthRedirect onLogin={onLogin} />;
        case 'home':
        default:
            return <SummarizerPage user={user} onLogin={onLogin} summary={summary} setSummary={setSummary} videoDetails={videoDetails} setVideoDetails={setVideoDetails} />;
    }
}

// --- Main Summarizer Page ---
const summaryLanguages = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' },
    { code: 'tr', name: 'Turkish' }
];

function SummarizerPage({ user, onLogin, summary, setSummary, videoDetails, setVideoDetails }) {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(summaryLanguages[0]);
    const [summaryLength, setSummaryLength] = useState('Detailed');
    const { t } = useContext(LanguageContext);

    const handleSummarize = async () => {
        if (!user) {
            setError(t('summaryError'));
            return;
        }
        if (!youtubeLink) {
            setError(t('linkError'));
            return;
        }
        setIsLoading(true);
        setError('');
        setSummary('');
        setVideoDetails(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ youtubeLink, language: selectedLanguage.name, length: summaryLength }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `An error occurred: ${response.statusText}`);
            }

            const data = await response.json();
            setSummary(data.summary);
            setVideoDetails(data.videoDetails);

            // Save to history
            const history = JSON.parse(localStorage.getItem(`history_${user.email}`)) || [];
            const newEntry = {
                id: Date.now(),
                videoDetails: data.videoDetails,
                summary: data.summary,
                date: new Date().toISOString(),
            };
            history.unshift(newEntry); // Add to the beginning
            localStorage.setItem(`history_${user.email}`, JSON.stringify(history));

        } catch (err) {
            setError(err.message || 'Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTooltip = (props) => (<Tooltip id="button-tooltip" {...props}>Please sign in to use this feature.</Tooltip>);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-2 mb-4">
                        <Card.Body className="p-4">
                            <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={!user ? renderTooltip : <></>}>
                                <div className="fieldset-wrapper">
                                    <fieldset disabled={!user}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold mb-2"><LinkIcon className="me-2" />{t('youtubeLink')}</Form.Label>
                                            <Form.Control type="text" placeholder={t('pasteLink')} value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} size="lg" className="border-2" />
                                        </Form.Group>
                                        <Row className="mb-2 align-items-end"> {/* Labels on the same line */}
                                            <Col md={8}>
                                                <Form.Label className="fw-bold"><Globe className="me-2" />{t('language')}</Form.Label>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Label className="fw-bold"><List className="me-2" />{t('summaryLength')}</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row className="g-3 mb-4"> {/* Controls below labels */}
                                            <Col md={8}>
                                                <DropdownButton title={selectedLanguage.name} variant="light" className="w-100" size="lg">
                                                    {summaryLanguages.map(lang => (
                                                        <Dropdown.Item key={lang.code} onClick={() => setSelectedLanguage(lang)}>{lang.name}</Dropdown.Item>
                                                    ))}
                                                </DropdownButton>
                                            </Col>
                                            <Col md={4}>
                                                <ButtonGroup className="w-100">
                                                    <Button variant={summaryLength === 'Short' ? 'primary' : 'outline-secondary'} onClick={() => setSummaryLength('Short')} size="lg">{t('short')}</Button>
                                                    <Button variant={summaryLength === 'Detailed' ? 'primary' : 'outline-secondary'} onClick={() => setSummaryLength('Detailed')} size="lg">{t('detailed')}</Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                    </fieldset>
                                </div>
                            </OverlayTrigger>

                            {videoDetails && !isLoading && (
                                <Card className="mb-4 text-start border-2">
                                    <Row className="g-0">
                                        <Col md={4}>
                                            <a href={`https://www.youtube.com/watch?v=${videoDetails.id}`} target="_blank" rel="noopener noreferrer">
                                                <Image src={videoDetails.thumbnail} fluid roundedStart style={{objectFit: 'cover', height: '100%', borderRight: '1px solid var(--bs-border-color-translucent)'}} />
                                            </a>
                                        </Col>
                                        <Col md={8}>
                                            <Card.Body>
                                                <Card.Title as="h6" className="fw-bold">
                                                    <a href={`https://www.youtube.com/watch?v=${videoDetails.id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{videoDetails.title}</a>
                                                </Card.Title>
                                                <Card.Text as="small" className="text-muted">by <a href={`https://www.youtube.com/channel/${videoDetails.channelId}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{videoDetails.channel}</a></Card.Text>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            <div className="d-grid">
                                <Button variant="primary" onClick={handleSummarize} disabled={isLoading || !user} size="lg">
                                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : <><FileText className="me-2" />{t('generateSummary')}</>}
                                </Button>
                            </div>
                            {!user && <div className="text-center mt-3"><Button variant="link" onClick={onLogin}>{t('signInToGetStarted')}</Button></div>}
                        </Card.Body>
                    </Card>

                    {error && <Alert variant="danger" className="border-2">{error}</Alert>}

                    {isLoading && (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                            <p className="mt-3 text-muted">{t('fetchingTranscript')}</p>
                        </div>
                    )}

                    {summary && (
                        <Card className="shadow-sm border-2 my-4">
                            <Card.Header as="h5" className="fw-bold"><FileText className="me-2" />{t('generatedSummary')}</Card.Header>
                            <Card.Body className="p-4">
                                <div style={{ lineHeight: '1.7' }}><ReactMarkdown>{summary}</ReactMarkdown></div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

// --- Settings Page ---
function SettingsPage({ theme, setTheme }) {
    const { language, setLanguage, t } = useContext(LanguageContext);
    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={6}>
                    <h2 className="mb-4 text-center">{t('settings')}</h2>
                    <Card className="shadow-sm border-2">
                        <Card.Body>
                            <Form.Group as={Row} className="mb-3 align-items-center" controlId="formTheme">
                                <Form.Label column sm={4}>{t('theme')}</Form.Label>
                                <Col sm={8}>
                                    <Form.Check type="switch" id="theme-switch" label={theme === 'dark' ? t('darkMode') : t('lightMode')} checked={theme === 'dark'} onChange={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 align-items-center" controlId="formLanguage">
                                <Form.Label column sm={4}>{t('interfaceLanguage')}</Form.Label>
                                <Col sm={8}>
                                    <Form.Select value={language} onChange={e => setLanguage(e.target.value)} className="border-2">
                                        <option value="en">English</option>
                                        <option value="tr">Türkçe</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// --- History Page ---
function HistoryPage({ user }) {
    const { t } = useContext(LanguageContext);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem(`history_${user.email}`)) || [];
        setHistory(savedHistory);
    }, [user.email]);

    const deleteHistoryItem = (id) => {
        const updatedHistory = history.filter(item => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem(`history_${user.email}`, JSON.stringify(updatedHistory));
    }

    if (history.length === 0) {
        return (
            <Container className="text-center">
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <Card className="shadow-sm border-2"><Card.Body className="p-5"><ClockHistory size={50} className="text-primary mb-3" /><h2>{t('summaryHistory')}</h2><p className="text-muted">{t('noHistory')}</p></Card.Body></Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <h2 className="mb-4 text-center">{t('summaryHistory')}</h2>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <ListGroup>
                        {history.map(item => (
                            <ListGroup.Item key={item.id} className="mb-3 p-0 border rounded shadow-sm border-2">
                                <Card>
                                    <Row className="g-0">
                                        <Col md={3}>
                                            <Image src={item.videoDetails.thumbnail} fluid roundedStart style={{objectFit: 'cover', height: '100%', borderRight: '1px solid var(--bs-border-color-translucent)'}}/>
                                        </Col>
                                        <Col md={9}>
                                            <Card.Body>
                                                <Card.Title as="h6" className="fw-bold">{item.videoDetails.title}</Card.Title>
                                                <Card.Text as="small" className="text-muted">{new Date(item.date).toLocaleString()}</Card.Text>
                                                <Card.Text className="mt-2 small" style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.summary}
                                                </Card.Text>
                                                <div className="mt-2">
                                                    <Button variant="outline-secondary" size="sm" href={`https://www.youtube.com/watch?v=${item.videoDetails.id}`} target="_blank">{t('viewOnYouTube')}</Button>
                                                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => deleteHistoryItem(item.id)}><Trash/></Button>
                                                </div>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

// --- Auth Redirect Component ---
function AuthRedirect({ onLogin }) {
    const { t } = useContext(LanguageContext);
    return (
        <Container className="text-center">
            <Row className="justify-content-center">
                <Col lg={6}>
                    <Card className="shadow-sm border-2">
                        <Card.Body className="p-5">
                            <PersonCircle size={50} className="text-danger mb-3" />
                            <h2>{t('accessDenied')}</h2>
                            <p className="text-muted">{t('loginToAccess')}</p>
                            <Button variant="primary" onClick={onLogin}><Google className="me-2" />{t('signInToContinue')}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// --- Footer Component ---
function AppFooter({ theme }) {
    const footerBgClass = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-muted';
    const linkClasses = theme === 'dark' ? 'px-2 text-light' : 'px-2 text-muted';

    return (
        <footer className={`py-4 mt-auto border-top ${footerBgClass}`} style={{borderColor: 'var(--bs-border-color-translucent) !important'}}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Compentube. All Rights Reserved.</p>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <Nav className="justify-content-center justify-content-md-end">
                            <Nav.Link href="#" className={linkClasses}>Privacy Policy</Nav.Link>
                            <Nav.Link href="#" className={linkClasses}>Terms of Service</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default App;

