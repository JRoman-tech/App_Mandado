import PropTypes from 'prop-types';

export default function RecipeCard({ recipes }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>📖 Recetas disponibles</h2>
        <p className="card-subtitle">{recipes.length} platillos en el catálogo</p>
      </div>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.name} className="recipe-card">
            <h3 className="recipe-name">{recipe.name}</h3>
            <div className="recipe-ingredients">
              <span className="ingredient-count">
                {recipe.ingredients.length} ingredientes
              </span>
              <ul className="ingredient-preview">
                {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                  <li key={idx}>{ing.item}</li>
                ))}
                {recipe.ingredients.length > 3 && (
                  <li className="more">+{recipe.ingredients.length - 3} más</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

RecipeCard.propTypes = {
  recipes: PropTypes.array.isRequired,
};
