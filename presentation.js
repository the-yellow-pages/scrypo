function createScrypoPresentationSlides() {
    // Create a new presentation
    const presentation = SlidesApp.create('Scrypo: Web3 Geolocation Social Platform');
    const slides = presentation.getSlides();

    // Remove the default slide
    slides[0].remove();

    // Slide 1: Title Slide
    createTitleSlide(presentation);

    // Slide 2: Abstract & Vision
    createAbstractSlide(presentation);

    // Slide 3: Problem Statement
    createProblemSlide(presentation);

    // Slide 4: Target Audience Analysis
    createTargetAudienceSlide(presentation);

    // Slide 5: Market Size & Opportunity
    createMarketSizeSlide(presentation);

    // Slide 6: Market Trends
    createMarketTrendsSlide(presentation);

    // Slide 7: Architecture Overview
    createArchitectureSlide(presentation);

    // Slide 8: Technical Stack
    createTechnicalStackSlide(presentation);

    // Slide 9: Core Features
    createCoreFeaturesSlide(presentation);

    // Slide 10: XMTP Integration
    createXMTPSlide(presentation);

    // Slide 11: Monetization Strategy
    createMonetizationSlide(presentation);

    // Slide 12: Geolocation Advertising
    createGeoAdvertisingSlide(presentation);

    // Slide 13: Data-as-a-Service
    createDaaSSlide(presentation);

    // Slide 14: Competitive Landscape
    createCompetitiveSlide(presentation);

    // Slide 15: SWOT Analysis
    createSWOTSlide(presentation);

    // Slide 16: User Acquisition Strategy
    createUserAcquisitionSlide(presentation);

    // Slide 17: Privacy & Compliance
    createPrivacySlide(presentation);

    // Slide 18: Quarterly Roadmap
    createRoadmapSlide(presentation);

    // Slide 19: Financial Projections
    createFinancialSlide(presentation);

    // Slide 20: Call to Action
    createCallToActionSlide(presentation);

    Logger.log('Presentation created: ' + presentation.getUrl());
    return presentation.getUrl();
}

function createTitleSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE);
    const title = slide.getPageElements()[0].asShape();
    const subtitle = slide.getPageElements()[1].asShape();

    title.getText().setText('SCRYPO');
    title.getText().getTextStyle().setFontSize(48).setBold(true).setForegroundColor('#1E3A8A');

    subtitle.getText().setText('Web3 Geolocation Social Platform\nConnecting Crypto Communities Through Real-World Proximity');
    subtitle.getText().getTextStyle().setFontSize(18).setForegroundColor('#374151');
}

function createAbstractSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Abstract & Vision');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#1E3A8A');

    const content = `🎯 VISION
To empower digital nomads and crypto-native users with real-time, location-aware social interactions

📱 WHAT IS SCRYPO?
• Geolocation-based Web3 social platform
• Enables crypto wallet users to discover and connect based on proximity
• Built on Starknet with XMTP messaging integration
• Transforms geospatial blockchain activity into monetization opportunities

💰 MONETIZATION
Global advertisers, local businesses, and data partners interact with anonymized, location-aware crypto communities through privacy-preserving infrastructure`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createProblemSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Problem Statement');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#DC2626');

    const content = `🚫 CURRENT PAIN POINTS

For Crypto Nomads:
• Struggle to find nearby crypto-friendly peers and businesses
• Traditional travel apps lack crypto context
• No real-time interaction with local crypto communities
• Difficulty discovering crypto-accepting venues

For Local Merchants:
• Want to signal crypto acceptance but lack discovery platform
• Missing targeted reach to crypto-savvy customers

For Event Organizers:
• Hard to target transient, decentralized crypto audiences
• Limited tools for crypto community engagement

💡 SCRYPO'S SOLUTION
Maps on-chain identities to geolocations while preserving privacy, enabling spontaneous meetups, networking, and venue discovery`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createTargetAudienceSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Target Audience Analysis');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#059669');

    const leftContent = `👥 PRIMARY PERSONAS

Crypto-Forward Digital Nomads:
• English/Russian-speaking remote workers
• Value mobility and crypto payments
• Work remotely while exploring new locales
• Prefer blockchain tools and decentralized solutions

🌍 KEY MARKETS
• Russia ranks 7th globally in crypto adoption
• CIS nomads in Kazakhstan, Georgia highly active
• UAE and Singapore lead crypto-friendliness rankings`;

    const rightContent = `🎯 SECONDARY USERS
• Local merchants in crypto-friendly destinations
• Event organizers targeting crypto communities
• Co-working spaces and hostels accepting crypto

📊 USER BEHAVIORS
• 77% of digital nomads are early technology adopters
• Use multiple devices and messaging apps (Telegram, Discord)
• Follow crypto/travel influencers on Twitter/X
• Value privacy and self-sovereignty`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createMarketSizeSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Market Size & Opportunity');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#7C3AED');

    const content = `📈 TOTAL ADDRESSABLE MARKET (TAM)

Global Digital Nomads: 35-40 million (2023-24)
• US alone: ~18.1M digital nomads
• 25% use cryptocurrency for payments
• Several million crypto-savvy nomads worldwide

🎯 SERVICEABLE AVAILABLE MARKET (SAM)
Target regions include:
• USA (>15% crypto ownership)
• UAE & Singapore (#1-2 crypto-friendly)
• Russia/CIS (high adoption rates)
• Portugal, Thailand, other nomad hubs

Conservative estimate: Low-to-mid millions potential users

🚀 SERVICEABLE OBTAINABLE MARKET (SOM)
Initial 2-3 years: 10,000s to 100,000s active users
Growth driver: Network effects in crypto communities`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createMarketTrendsSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Market Trends & Opportunity');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#EA580C');

    const leftContent = `🌐 WEB3 SOCIAL EXPLOSION
• Market growing from $7.2B (2024) to $471B (2034)
• 52% CAGR growth rate
• 10M+ daily active Web3 users by mid-2024

🗺️ GEO + BLOCKCHAIN CONVERGENCE
• Projects like XYO and Geo Web pioneering space
• Location-based social apps gaining traction
• AR/Metaverse trends enhancing opportunity`;

    const rightContent = `💰 CRYPTO COMMERCE GROWTH
• 25% of nomads use crypto for purchases
• DAO market: $124M (2023) → $681M (2033)
• 18.6% CAGR in DAO-as-a-Service platforms

🎯 PERFECT TIMING
• Booming crypto adoption in target regions
• Surge in digital nomad visas globally
• Increasing demand for decentralized social experiences`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createArchitectureSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Architecture Overview');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#1E40AF');

    const content = `🏗️ TECHNICAL ARCHITECTURE

🔗 Starknet (Layer 2)
• User profiles and initial key exchange
• Messaging initialization stored as on-chain events
• Low-cost, fast transactions

💬 XMTP (Off-chain Messaging)
• Secure, end-to-end encrypted chats
• Activated after on-chain key exchange
• Decentralized messaging protocol

⚡ Apibara Indexer
• Real-time event tracking from Starknet
• Efficient blockchain data indexing

🖥️ Frontend
• React-based web interface
• Future mobile app for GPS integration

🔧 Backend Services
• Ad matching algorithms
• Analytics aggregation
• Business portals (off-chain)`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createTechnicalStackSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Technical Stack');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#0891B2');

    const leftContent = `⚙️ CURRENT IMPLEMENTATION

Blockchain Layer:
• Starknet smart contracts (Cairo language)
• Apibara for real-time indexing
• Wallet authentication (SIWE)

Frontend:
• React.js with TypeScript
• Web3 wallet integration
• Responsive design for mobile`;

    const rightContent = `🚀 PLANNED ADDITIONS

Mobile Development:
• React Native or Flutter
• Native GPS access
• Background location tracking
• Push notifications

Infrastructure:
• Supabase for analytics dashboard
• Chart.js/Recharts for data visualization
• REST/GraphQL API gateway

Privacy & Security:
• Hash-based data aggregation
• k-anonymity thresholds
• On-device data pre-processing`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createCoreFeaturesSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Core Features');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#DC2626');

    const content = `🎯 KEY PLATFORM FEATURES

📍 Real-Time Geolocation Mapping
• Live map of crypto wallet users
• Privacy-controlled location sharing
• Proximity-based discovery

💬 Decentralized Messaging
• On-chain key exchange via Starknet
• Secure XMTP messaging
• End-to-end encryption

🏪 Business Discovery
• Crypto-accepting venues
• Local merchant listings
• Event announcements

📊 Privacy-First Analytics
• Anonymized behavioral data
• User-controlled data sharing
• GDPR-compliant design

🎉 Community Features
• Spontaneous meetup coordination
• Interest-based groups
• Event organization tools`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}

function createXMTPSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('XMTP Integration');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#059669');

    const leftContent = `💬 DECENTRALIZED MESSAGING LAYER

🔐 Current Implementation:
• On-chain messaging system via Starknet
• Key generation during initial user interaction
• Secure wallet-to-wallet communication

🚀 XMTP Integration Roadmap:

Phase 1: Frontend Integration
• Bind wallet to XMTP identity using JS SDK
• Transition from on-chain → XMTP after key exchange
• Maintain message history and continuity`;

    const rightContent = `Phase 2: Enhanced Features
• One-on-one encrypted messaging
• Optional group chat support
• Event-triggered channel logs

Phase 3: Mobile Optimization
• Push notification support
• Native iOS/Android integration
• Background message synchronization

✅ Benefits:
• Reduced on-chain costs
• Improved scalability
• Enhanced privacy`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createMonetizationSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Monetization Strategy');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#7C2D12');

    const leftContent = `💰 REVENUE STREAMS

1️⃣ Geolocation Advertising
• Local geo-targeted ads
• Pay-per-impression/click model
• Premium CPM for crypto audiences

2️⃣ Data-as-a-Service (DaaS)
• Anonymized behavioral analytics
• B2B subscriptions for tourism boards
• API access for market researchers`;

    const rightContent = `3️⃣ Premium Features
• Token-gated advanced analytics
• Enhanced business profiles
• Priority messaging and visibility

4️⃣ Strategic Partnerships
• Sponsored venue listings
• Event promotion partnerships
• Crypto payment processor integrations

📊 Revenue Projections:
• Year 1: Focus on user acquisition
• Year 2: $100K+ from advertising
• Year 3: $500K+ multi-stream revenue`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createGeoAdvertisingSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Geolocation Advertising');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#B91C1C');

    const leftContent = `📍 REAL-TIME MONETIZATION

🎯 Geofencing Technology:
• Trigger notifications near crypto venues
• Proximity-based ad delivery
• Location-aware content promotion

📱 Mobile Implementation:
• Background location tracking (with consent)
• Push notifications for nearby offers
• React Native geolocation services

🏪 Merchant Portal Features:
• Campaign creation interface
• Geofenced area selection
• Performance analytics dashboard
• Content upload and management`;

    const rightContent = `💡 Use Cases:
• Crypto café promotions
• Co-working space advertisements
• Event announcements
• Local service provider listings

📈 Revenue Model:
• Cost-per-click (CPC)
• Cost-per-impression (CPM)
• Premium placement fees
• Performance-based pricing`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createDaaSSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Data-as-a-Service (DaaS)');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#7C3AED');

    const leftContent = `📊 ANONYMIZED BEHAVIORAL ANALYTICS

🔍 Data Collection:
• Location check-ins and dwell time
• Profile views and interactions
• Message frequency patterns
• Crypto transaction correlations

📈 Analytics Products:
• Wallet density heatmaps
• Crypto-tourist flow patterns
• Engagement duration metrics
• Regional adoption trends`;

    const rightContent = `🎯 Target Customers:
• Tourism boards and city planners
• Web3 businesses and startups
• Market research companies
• Crypto payment processors

🔐 Privacy Protection:
• Hash-based aggregation
• k-anonymity thresholds (minimum group sizes)
• On-device data pre-processing
• GDPR-compliant data handling

💰 Subscription Tiers:
• Basic: City-level aggregated data
• Premium: Real-time analytics API
• Enterprise: Custom reporting and insights`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createCompetitiveSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Competitive Landscape');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#EA580C');

    const leftContent = `🏆 KEY COMPETITORS

Friend.tech (Base Network)
• Social token trading platform
• $2B volume in first month
• Differentiation: Not location-based

XMTP Protocol
• 2M+ connected identities, 60+ apps
• Decentralized messaging infrastructure
• Differentiation: Backend only, no geospatial focus`;

    const rightContent = `POAP (Proof of Attendance)
• Event attendance NFT badges
• Widely used at crypto meetups
• Differentiation: Static event proof vs. real-time discovery

Orbis Digital Tribes
• Location-based social app, 10K+ downloads
• Gamified territory claiming
• Differentiation: Not crypto-native, uses traditional logins

🎯 SCRYPO'S UNIQUE VALUE:
• First location-based Web3 social network
• Wallet-native identity system
• Real-time crypto community mapping
• Privacy-first monetization model`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createSWOTSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('SWOT Analysis');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#059669');

    const leftContent = `💪 STRENGTHS
• Unique Web3 + geolocation combination
• Privacy-minded decentralized design
• Mobile-first UX for nomads
• Multilingual support (English/Russian)

⚠️ WEAKNESSES
• Nascent user base (network effects needed)
• Crypto knowledge required for onboarding
• GPS usage raises battery/privacy concerns`;

    const rightContent = `🚀 OPPORTUNITIES
• Booming crypto adoption in target regions
• Surge in digital nomad visas globally
• Partnership potential with crypto businesses
• NFT and DAO integration possibilities

⚡ THREATS
• Privacy/regulatory scrutiny
• High on-chain transaction costs
• Competition from big tech platforms
• Economic downturns affecting crypto travel

🎯 MITIGATION STRATEGIES
• Layer-2 solutions for cost reduction
• Opt-in privacy controls
• Strategic partnerships for user acquisition`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createUserAcquisitionSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('User Acquisition Strategy');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#0891B2');

    const leftContent = `🎯 MULTI-CHANNEL APPROACH

📱 Digital Channels:
• Web3 communities (Twitter/X, Telegram, Discord)
• Crypto podcasts and blogs
• Travel/nomad forums (Nomad List, Remote Year)
• Russian crypto Telegram groups

🎪 Events & Conferences:
• ETHDubai, Web3 summits, Bitcoin conferences
• Digital nomad meetups (DNX, Nomad Cruise)
• Local crypto meetups and hackathons`;

    const rightContent = `🤝 Strategic Partnerships:
• Selina hostels (global nomad network)
• Crypto-friendly hotels in Dubai/Singapore
• Co-working spaces (WeWork, local hubs)
• Crypto payment processors (BitPay, Travala)

🌟 Influencer Marketing:
• Travel/crypto influencers with referral codes
• Success model: Friend.tech's viral growth
• Nomad YouTubers and bloggers

📍 Location-Based:
• Tourism boards targeting remote workers
• Visa program partnerships (Hungary DHO, UAE Golden Visa)`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(12).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(12).setForegroundColor('#374151');
}

function createPrivacySlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Privacy & Compliance');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#DC2626');

    const leftContent = `🔐 PRIVACY-FIRST DESIGN

🎛️ User Control:
• Explicit location sharing consent
• Granular privacy settings
• Precise vs. approximate location options
• Temporary vs. persistent sharing

📊 Data Minimization:
• No raw GPS stored on-chain
• Only anonymized statistics collected
• Hash-based data aggregation
• k-anonymity thresholds`;

    const rightContent = `⚖️ Regulatory Compliance:
• GDPR principles (privacy by design)
• Right to data deletion
• Transparent data usage policies
• Regional law compliance (varies by country)

🛡️ Technical Safeguards:
• End-to-end encryption via XMTP
• On-device data pre-processing
• Wallet-based pseudonymous identity
• No KYC requirements

🌍 Global Considerations:
• Light-touch regulatory approach
• Focus on crypto-friendly jurisdictions
• Avoid storing personal information`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createRoadmapSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Quarterly Roadmap (Year 1)');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#7C3AED');

    const content = `📅 2025-2026 DEVELOPMENT TIMELINE

Q2 2025: Core MVP Completion
• Finalize Starknet smart contracts
• Complete Apibara indexer
• Launch web frontend with wallet login
• Implement on-chain messaging

Q3 2025: Mobile Prototype + Geofencing
• Launch mobile app prototype
• Integrate GPS and location consent
• Implement geofencing and push notifications
• Add XMTP off-chain messaging

Q4 2025: Ad Infrastructure + Analytics Beta
• Deploy static ad mockups
• Build Merchant Portal UI
• Create analytics dashboard
• Setup subscription token gating

Q1 2026: Monetization Go-Live
• Launch real-time ad matching
• Onboard crypto businesses
• Release DaaS API access
• Begin B2B subscriber acquisition`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createFinancialSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_TWO_COLUMNS);
    const title = slide.getPageElements()[0].asShape();
    const leftColumn = slide.getPageElements()[1].asShape();
    const rightColumn = slide.getPageElements()[2].asShape();

    title.getText().setText('Financial Projections');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#059669');

    const leftContent = `💰 3-YEAR FINANCIAL OUTLOOK

Year 1 (2025): Foundation Building
• Revenue: $0-10K (focus on user acquisition)
• Users: 1,000-5,000 active users
• Expenses: Development, infrastructure
• Funding needs: $500K-1M seed round

Year 2 (2026): Monetization Launch
• Revenue: $50K-150K
• Users: 10,000-25,000 active users
• Revenue mix: 70% advertising, 30% premium features
• Break-even on operational costs`;

    const rightContent = `Year 3 (2027): Scale & Expansion
• Revenue: $300K-800K
• Users: 50,000-100,000 active users
• Revenue mix: 50% ads, 30% DaaS, 20% premium
• Profitable operations, Series A readiness

📊 Key Metrics:
• Average Revenue Per User (ARPU): $5-15
• Customer Acquisition Cost (CAC): $10-25
• Monthly Active Users growth: 15-25%`;

    leftColumn.getText().setText(leftContent);
    leftColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');

    rightColumn.getText().setText(rightContent);
    rightColumn.getText().getTextStyle().setFontSize(13).setForegroundColor('#374151');
}

function createCallToActionSlide(presentation) {
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const title = slide.getPageElements()[0].asShape();
    const body = slide.getPageElements()[1].asShape();

    title.getText().setText('Join the Scrypo Revolution');
    title.getText().getTextStyle().setFontSize(32).setBold(true).setForegroundColor('#DC2626');

    const content = `🚀 THE OPPORTUNITY IS NOW

🌍 Market Timing:
• 35-40M digital nomads globally
• Web3 social market: $7.2B → $471B (2024-2034)
• Crypto adoption surging in target regions

💡 Unique Value Proposition:
• First location-based Web3 social platform
• Privacy-first monetization model
• Real-time crypto community mapping

🎯 What We Need:
• Seed funding: $500K-1M
• Strategic partnerships
• Early adopter community
• Technical talent acquisition

📞 Next Steps:
• Demo the MVP platform
• Pilot partnerships in Dubai/Singapore
• Community building initiatives
• Investor meetings and due diligence

Contact: team@scrypo.com
Website: www.scrypo.com`;

    body.getText().setText(content);
    body.getText().getTextStyle().setFontSize(14).setForegroundColor('#374151');
}
