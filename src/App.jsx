import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Sparkles, Users, UtensilsCrossed, Receipt, TrendingUp, Star, Zap } from 'lucide-react';
import PeopleInputForm from './components/PeopleInputForm';
import DishInputForm from './components/DishInputForm';
import DishAssignmentForm from './components/DishAssignmentForm';
import TaxInput from './components/TaxInput';
import ResultDisplay from './components/ResultDisplay';
import AuthForm from './components/AuthForm';
import MyBills from './components/MyBills';

const NAV_PAGES = {
  HOME: 'home',
  MY_BILLS: 'my_bills',
  ACCOUNT: 'account',
  LOGIN: 'login',
};

const Navbar = ({ isAuthenticated, onLogout, onNav, currentPage }) => (
  <nav style={{
    width: '100%',
    background: '#f5f5f4',
    borderBottom: '2px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 0',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    zIndex: 10,
    position: 'sticky',
    top: 0,
  }}>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      {isAuthenticated ? (
        <>
          <button
            className={`navbar-btn${currentPage === NAV_PAGES.HOME ? ' active' : ''}`}
            onClick={() => onNav(NAV_PAGES.HOME)}
            style={{ minWidth: 90 }}
          >Home</button>
          <button
            className={`navbar-btn${currentPage === NAV_PAGES.MY_BILLS ? ' active' : ''}`}
            onClick={() => onNav(NAV_PAGES.MY_BILLS)}
            style={{ minWidth: 90 }}
          >Your Bills</button>
          <button
            className={`navbar-btn${currentPage === NAV_PAGES.ACCOUNT ? ' active' : ''}`}
            onClick={() => onNav(NAV_PAGES.ACCOUNT)}
            style={{ minWidth: 90 }}
          >Your Account</button>
          <button
            className="navbar-btn logout"
            onClick={onLogout}
            style={{ minWidth: 90 }}
          >Logout</button>
        </>
      ) : (
        <button
          className={`navbar-btn${currentPage === NAV_PAGES.LOGIN ? ' active' : ''}`}
          onClick={() => onNav(NAV_PAGES.LOGIN)}
          style={{ minWidth: 90 }}
        >Login</button>
      )}
    </div>
  </nav>
);

const App = () => {
  const [people, setPeople] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [taxAmount, setTaxAmount] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [personTotals, setPersonTotals] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showMyBills, setShowMyBills] = useState(false);
  const [page, setPage] = useState(NAV_PAGES.LOGIN);

  // Auto-advance steps based on data
  useEffect(() => {
    if (people.length > 0 && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 500);
    }
    if (dishes.length > 0 && currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 500);
    }
  }, [people.length, dishes.length, currentStep]);

  const addPerson = (personName) => {
    if (personName.trim() && !people.includes(personName.trim())) {
      setPeople([...people, personName.trim()]);
      setShowResults(false);
    }
  };

  const removePerson = (index) => {
    const personToRemove = people[index];
    setPeople(people.filter((_, i) => i !== index));
    // Remove person from all dishes
    setDishes(dishes.map(dish => ({
      ...dish,
      consumers: dish.consumers.filter(consumer => consumer !== personToRemove)
    })));
    setShowResults(false);
  };

  const addDish = (dishName, dishCost) => {
    if (dishName.trim() && dishCost.trim()) {
      const cost = parseFloat(dishCost);
      if (cost > 0) {
        setDishes([...dishes, {
          id: Date.now(),
          name: dishName.trim(),
          cost: cost,
          consumers: []
        }]);
        setShowResults(false);
      }
    }
  };

  const removeDish = (id) => {
    setDishes(dishes.filter(dish => dish.id !== id));
    setShowResults(false);
  };

  const toggleConsumer = (dishId, person) => {
    setDishes(dishes.map(dish => {
      if (dish.id === dishId) {
        const consumers = dish.consumers.includes(person)
          ? dish.consumers.filter(c => c !== person)
          : [...dish.consumers, person];
        return { ...dish, consumers };
      }
      return dish;
    }));
    setShowResults(false);
  };

  const calculateBill = async () => {
    if (people.length === 0 || dishes.length === 0) {
      alert('Please add people and dishes first');
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tax = parseFloat(taxAmount) || 0;
    const totals = {};
    
    // Initialize totals
    people.forEach(person => {
      totals[person] = 0;
    });

    // Calculate dish costs
    dishes.forEach(dish => {
      if (dish.consumers.length > 0) {
        const sharePerPerson = dish.cost / dish.consumers.length;
        dish.consumers.forEach(consumer => {
          totals[consumer] += sharePerPerson;
        });
      }
    });

    // Add tax split equally
    if (tax > 0) {
      const taxPerPerson = tax / people.length;
      people.forEach(person => {
        totals[person] += taxPerPerson;
      });
    }

    setPersonTotals(totals);
    setShowResults(true);
    setIsCalculating(false);
    setCurrentStep(4);
    setShowCelebration(true);
    
    // Hide celebration after 3 seconds
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const resetAll = () => {
    setPeople([]);
    setDishes([]);
    setTaxAmount('');
    setShowResults(false);
    setPersonTotals({});
    setCurrentStep(1);
    setShowCelebration(false);
  };

  const totalBill = dishes.reduce((sum, dish) => sum + dish.cost, 0) + (parseFloat(taxAmount) || 0);

  const steps = [
    { number: 1, icon: Users, title: "Add Friends", description: "Who's joining the feast?", completed: people.length > 0 },
    { number: 2, icon: UtensilsCrossed, title: "Add Dishes", description: "What did you order?", completed: dishes.length > 0 },
    { number: 3, icon: Star, title: "Assign Dishes", description: "Who ate what?", completed: dishes.some(d => d.consumers.length > 0) },
    { number: 4, icon: Calculator, title: "Calculate", description: "Split the bill!", completed: showResults }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setPage(NAV_PAGES.MY_BILLS);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setPage(NAV_PAGES.LOGIN);
  };

  // Navigation logic
  useEffect(() => {
    if (!isAuthenticated) setPage(NAV_PAGES.LOGIN);
    else if (page === NAV_PAGES.LOGIN) setPage(NAV_PAGES.MY_BILLS);
  }, [isAuthenticated]);

  // Render logic
  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onNav={setPage}
        currentPage={page}
      />
      <div className="min-h-screen flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-5xl mx-auto">
          {(!isAuthenticated && page === NAV_PAGES.LOGIN) && (
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          )}
          {(isAuthenticated && page === NAV_PAGES.MY_BILLS) && (
            <MyBills onBack={() => setPage(NAV_PAGES.HOME)} />
          )}
          {(isAuthenticated && page === NAV_PAGES.ACCOUNT) && (
            <div className="enhanced-card" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Your Account</h2>
              <p>Account details and settings coming soon.</p>
            </div>
          )}
          {(isAuthenticated && page === NAV_PAGES.HOME) && (
            <>
              {/* Hero/Header Section */}
              <div style={{
                background: 'linear-gradient(90deg, #fa8231 0%, #f76d6d 100%)',
                color: '#fff',
                borderRadius: '2rem',
                padding: '2.5rem 1rem 3.5rem 1rem',
                marginBottom: '2.5rem',
                boxShadow: '0 8px 32px rgba(250,130,49,0.12)',
                textAlign: 'center',
                position: 'relative',
              }}>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>✨</span>
                  <span>SplitBITE</span>
                  <span style={{ fontSize: '2.2rem' }}>✨</span>
                </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-1px', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  Smart Bill Splitting Made Easy
                </div>
              </div>
              {/* Main Content with Enhanced Spacing */}
              <div className="space-y-8">
                <PeopleInputForm 
                  people={people}
                  onAddPerson={addPerson}
                  onRemovePerson={removePerson}
                />
                <DishInputForm 
                  dishes={dishes}
                  onAddDish={addDish}
                  onRemoveDish={removeDish}
                />
                <DishAssignmentForm 
                  dishes={dishes}
                  people={people}
                  onToggleConsumer={toggleConsumer}
                />
                <TaxInput 
                  taxAmount={taxAmount}
                  onTaxChange={setTaxAmount}
                />
              </div>
              {/* Main Action Buttons */}
              <div className="flex flex-col items-center gap-6 mt-16">
                <button
                  onClick={calculateBill}
                  disabled={isCalculating}
                  className="big-dark-btn"
                >
                  {isCalculating ? 'Calculating Magic...' : "Calculate everyone's share"}
                </button>
                {(people.length > 0 || dishes.length > 0) && (
                  <button
                    onClick={resetAll}
                    className="big-dark-btn"
                    style={{ background: '#a65555', marginTop: '1rem' }}
                  >
                    Start Over
                  </button>
                )}
              </div>
              {showResults && (
                <div className="mt-10">
                  <ResultDisplay 
                    personTotals={personTotals}
                    totalBill={totalBill}
                    taxAmount={parseFloat(taxAmount) || 0}
                    people={people}
                    dishes={dishes}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;