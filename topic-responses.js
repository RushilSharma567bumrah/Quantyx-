// Topic-specific responses for Quanty AI

// Collection of topic responses
const topicResponses = {
  // People and personalities
  "narendra modi": `Narendra Modi is an Indian politician who has served as the 14th Prime Minister of India since 2014.

Key facts:
1. Born on September 17, 1950, in Vadnagar, Gujarat, India
2. Served as Chief Minister of Gujarat from 2001 to 2014
3. Member of the Bharatiya Janata Party (BJP) and its parent organization, the Rashtriya Swayamsevak Sangh (RSS)
4. Implemented various economic reforms including demonetization and the Goods and Services Tax (GST)
5. Known for his foreign policy initiatives and international diplomacy

Modi's government has focused on infrastructure development, digital initiatives, and social welfare programs. His leadership style and policies have both supporters and critics, with debates around economic performance, social harmony, and democratic values.`,

  "elon musk": `Elon Musk is a business magnate, industrial designer, and entrepreneur known for founding and leading multiple innovative companies.

Key roles and companies:
1. CEO and Product Architect of Tesla, Inc. - electric vehicles, clean energy, and automotive technology
2. Founder, CEO, and Chief Engineer of SpaceX - aerospace manufacturer and space transportation company
3. Owner of Twitter/X - social media platform
4. Founder of The Boring Company - infrastructure and tunnel construction
5. Co-founder of Neuralink - neurotechnology company developing brain-machine interfaces
6. Co-founder of OpenAI (initially) - artificial intelligence research laboratory
7. Founder of xAI - artificial intelligence company

Musk is known for his ambitious goals including colonizing Mars, accelerating sustainable energy adoption, and developing artificial general intelligence. His unconventional approach and public statements often generate significant media attention and controversy.`,

  // General knowledge topics
  "desalination": `Desalination is the process of removing salt and other minerals from seawater to make it suitable for human consumption and irrigation. 

Key methods include:
1. Thermal distillation - heating seawater and collecting the condensed vapor
2. Reverse osmosis - forcing water through semi-permeable membranes under pressure
3. Electrodialysis - using electrical current to separate salt ions from water

While desalination provides a reliable freshwater source for water-scarce regions, challenges include high energy consumption, environmental impacts from brine discharge, and significant infrastructure costs. Countries like Saudi Arabia, UAE, and Israel rely heavily on desalination technology.

Recent innovations focus on energy efficiency, renewable energy integration, and minimizing environmental impacts.`,

  "climate change": `Climate change refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities, especially the burning of fossil fuels.

Key aspects include:
1. Rising global temperatures (global warming)
2. Increasing frequency of extreme weather events
3. Rising sea levels due to melting ice caps and thermal expansion
4. Ocean acidification affecting marine ecosystems
5. Shifts in wildlife populations and habitats

The scientific consensus is that human activities have warmed the atmosphere, ocean, and land, producing widespread and rapid changes. The Paris Agreement aims to limit global warming to well below 2°C compared to pre-industrial levels.

Mitigation strategies include transitioning to renewable energy, improving energy efficiency, sustainable agriculture, and carbon capture technologies.`,

  "artificial intelligence": `Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence.

Key branches include:
1. Machine Learning - systems that learn from data
2. Natural Language Processing - understanding and generating human language
3. Computer Vision - interpreting visual information
4. Robotics - physical systems with AI capabilities

AI applications span numerous fields including healthcare (diagnosis, drug discovery), finance (fraud detection, algorithmic trading), transportation (autonomous vehicles), and everyday consumer technology (virtual assistants, recommendation systems).

While AI offers tremendous benefits, it also raises concerns about privacy, bias, job displacement, and safety. The field is rapidly evolving, with recent advances in deep learning and neural networks enabling previously impossible capabilities.`,

  "quantum computing": `Quantum computing harnesses quantum mechanics principles to process information in fundamentally different ways than classical computers.

Key concepts:
1. Qubits - quantum bits that can exist in multiple states simultaneously (superposition)
2. Entanglement - quantum correlation between qubits regardless of distance
3. Quantum gates - operations that manipulate qubits

Unlike classical computers that use bits (0 or 1), quantum computers use qubits that can represent multiple values simultaneously, potentially solving certain problems exponentially faster.

Practical applications include cryptography, drug discovery, materials science, optimization problems, and simulating quantum systems. However, quantum computers remain experimental, facing challenges in maintaining quantum states (coherence) and scaling up to practical sizes.

Companies like IBM, Google, and Microsoft are racing to develop practical quantum computers, with some achieving "quantum advantage" for specific tasks.`,

  "renewable energy": `Renewable energy comes from naturally replenishing sources that are virtually inexhaustible.

Major types include:
1. Solar - photovoltaic panels and concentrated solar power
2. Wind - onshore and offshore turbines
3. Hydroelectric - dams and run-of-river systems
4. Geothermal - harnessing Earth's internal heat
5. Biomass - organic material from plants and animals
6. Tidal/Wave - ocean energy systems

Advantages include reduced greenhouse gas emissions, energy independence, and decreasing costs. Challenges include intermittency (requiring storage solutions), initial investment costs, and geographic limitations.

Renewable energy is growing rapidly worldwide, with many countries setting ambitious targets for carbon neutrality. Innovations in energy storage, smart grids, and efficiency are helping overcome traditional limitations.`,

  // Additional topics
  "blockchain": `Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography.

Key features:
1. Decentralization - no single entity controls the entire network
2. Transparency - all transactions are visible to network participants
3. Immutability - once recorded, data cannot be altered retroactively
4. Security - cryptographic techniques protect data integrity

Blockchain is the underlying technology for cryptocurrencies like Bitcoin and Ethereum, but its applications extend to supply chain management, voting systems, identity verification, smart contracts, and more.

While blockchain offers benefits in trust, security, and efficiency, challenges include scalability, energy consumption (particularly for proof-of-work systems), regulatory uncertainty, and integration with existing systems.`,

  "machine learning": `Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

Key approaches include:
1. Supervised Learning - training with labeled data to make predictions
2. Unsupervised Learning - finding patterns in unlabeled data
3. Reinforcement Learning - learning through interaction with an environment
4. Deep Learning - using neural networks with multiple layers

Applications span numerous fields including image and speech recognition, recommendation systems, natural language processing, autonomous vehicles, medical diagnosis, and financial modeling.

Challenges include data quality and quantity requirements, interpretability (especially for deep learning models), bias in training data, and computational resources needed for complex models.`
};


// Function to get response for a topic
function getTopicResponse(message) {
  // Convert message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // First check for exact topic matches
  for (const [topic, response] of Object.entries(topicResponses)) {
    // Check for exact topic matches like "who is narendra modi"
    if (lowerMessage.includes(`who is ${topic}`) || 
        lowerMessage.includes(`what is ${topic}`) || 
        lowerMessage.includes(`tell me about ${topic}`) || 
        lowerMessage === topic) {
      return response;
    }
  }
  
  // Then check for partial matches
  for (const [topic, response] of Object.entries(topicResponses)) {
    if (lowerMessage.includes(topic)) {
      return response;
    }
  }
  
  // No specific topic found
  return null;
}