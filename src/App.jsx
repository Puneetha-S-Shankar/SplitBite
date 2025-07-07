import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
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

  const calculateBill = () => {
    if (people.length === 0 || dishes.length === 0) {
      alert('Please add people and dishes first');
      return;
    }

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
  };

  const resetAll = () => {
    setPeople([]);
    setDishes([]);
    setTaxAmount('');
    setShowResults(false);
    setPersonTotals({});
  };

  const totalBill = dishes.reduce((sum, dish) => sum + dish.cost, 0) + (parseFloat(taxAmount) || 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="main-title">SplitBITE</div>
        <div className="flex flex-row gap-6 mb-6">
          <div className="section-header flex-1">ADD your friends</div>
          <div className="section-header flex-1">What and all did your order</div>
        </div>
        <div className="section-header mb-10">Who at what??</div>
        {/* Placeholders for forms and assignment, styled as plain blocks for now */}
        <div className="mb-10">
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
        <button
          onClick={calculateBill}
          className="big-dark-btn"
        >
          Calculate everyone's share
        </button>
        {showResults && (
          <div className="mt-10">
            <ResultDisplay 
              personTotals={personTotals}
              totalBill={totalBill}
              taxAmount={parseFloat(taxAmount) || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;