import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Sparkles, Users, UtensilsCrossed, Receipt, TrendingUp, Star, Zap } from 'lucide-react';
import PeopleInputForm from './components/PeopleInputForm';
import DishInputForm from './components/DishInputForm';
import DishAssignmentForm from './components/DishAssignmentForm';
import TaxInput from './components/TaxInput';
import ResultDisplay from './components/ResultDisplay';

const App = () => {
  const [people, setPeople] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [taxAmount, setTaxAmount] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [personTotals, setPersonTotals] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 animate-bounce blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 animate-bounce blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-20 animate-pulse blur-lg" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full opacity-10 animate-bounce blur-2xl" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(251, 146, 60) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping">
              <Sparkles className="w-32 h-32 text-yellow-400 opacity-80" />
            </div>
          </div>
          {/* Confetti-like elements */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                ['from-yellow-400 to-orange-500', 'from-orange-400 to-red-500', 'from-red-400 to-pink-500'][Math.floor(Math.random() * 3)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Enhanced Hero Title */}
          <div className="text-center mb-12 relative">
            <div className="main-title relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-6">
                <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
                <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                  SplitBITE
                </span>
                <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="text-lg font-medium text-yellow-200 opacity-90 animate-pulse">
                  ✨ Smart Bill Splitting Made Easy ✨
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="mb-12 bg-white/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
            
            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-800">Your Progress</h3>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <span className="text-xl font-bold text-orange-700">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-500 group cursor-pointer
                    ${step.completed 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/30' 
                      : currentStep === step.number 
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-500/30 animate-pulse' 
                        : 'bg-white/20 border-white/40 text-orange-800 hover:bg-white/30'
                    }
                  `}>
                    <div className="flex items-center justify-center mb-3">
                      <step.icon size={32} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm opacity-90">{step.description}</p>
                    
                    {step.completed && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-yellow-800" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-700 opacity-80">People</p>
                  <p className="text-3xl font-bold text-orange-800">{people.length}</p>
                </div>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(people.length * 25, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UtensilsCrossed className="text-white w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-700 opacity-80">Dishes</p>
                  <p className="text-3xl font-bold text-orange-800">{dishes.length}</p>
                </div>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(dishes.length * 20, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Receipt className="text-white w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-700 opacity-80">Total Bill</p>
                  <p className="text-3xl font-bold text-orange-800">₹{totalBill.toFixed(2)}</p>
                </div>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(totalBill / 10, 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="text-white w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-700 opacity-80">Status</p>
                  <p className="text-lg font-bold text-orange-800">
                    {showResults ? '✅ Complete' : '⏳ In Progress'}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500" style={{ width: `${showResults ? 100 : progressPercentage}%` }}></div>
              </div>
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

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col items-center gap-6 mt-16">
            <button
              onClick={calculateBill}
              disabled={isCalculating}
              className={`
                relative group overflow-hidden px-12 py-6 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
                ${isCalculating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-3xl'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-4">
                {isCalculating ? (
                  <>
                    <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                    <span>Calculating Magic...</span>
                  </>
                ) : (
                  <>
                    <Calculator size={32} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Calculate Everyone's Share</span>
                    <Sparkles size={24} className="animate-pulse" />
                  </>
                )}
              </div>
            </button>
            
            {(people.length > 0 || dishes.length > 0) && (
              <button
                onClick={resetAll}
                className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-xl text-orange-800 hover:bg-white/30 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <RotateCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Start Over</span>
              </button>
            )}
          </div>

          {/* Enhanced Results Section */}
          {showResults && (
            <div className="mt-16 animate-fadeIn">
              <ResultDisplay 
                personTotals={personTotals}
                totalBill={totalBill}
                taxAmount={parseFloat(taxAmount) || 0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;