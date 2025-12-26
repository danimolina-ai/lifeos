// Script para poblar datos globales en Supabase
import { createClient } from '@supabase/supabase-js'
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../src/data/foodDatabase.js'
import { EXERCISE_DATABASE, EQUIPMENT_TYPES } from '../src/data/exerciseDatabase.js'

const supabaseUrl = 'https://qwnhkbzzdlmwewatjkbk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // Necesitarás esto

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function populateGlobalData() {
    console.log('🚀 Poblando datos globales en Supabase...\n')

    // 1. Poblar categorías de alimentos
    console.log('📁 Insertando categorías de alimentos...')
    const { error: catError } = await supabase
        .from('food_categories')
        .upsert(FOOD_CATEGORIES, { onConflict: 'id' })

    if (catError) {
        console.error('❌ Error al insertar categorías:', catError)
    } else {
        console.log(`✅ ${FOOD_CATEGORIES.length} categorías insertadas\n`)
    }

    // 2. Poblar alimentos globales
    console.log('🍽️  Insertando alimentos globales...')
    const foodsToInsert = FOOD_DATABASE.map(food => ({
        food_id: food.id,
        name: food.name,
        category: food.category,
        serving: food.serving,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        fiber: food.fiber || 0,
        sugar: food.sugar || 0,
        sodium: food.sodium || 0,
        barcode: food.barcode || null
    }))

    const { error: foodError } = await supabase
        .from('global_foods')
        .upsert(foodsToInsert, { onConflict: 'food_id' })

    if (foodError) {
        console.error('❌ Error al insertar alimentos:', foodError)
    } else {
        console.log(`✅ ${foodsToInsert.length} alimentos insertados\n`)
    }

    // 3. Poblar ejercicios globales
    console.log('💪 Insertando ejercicios globales...')
    const exercisesToInsert = []

    Object.entries(EXERCISE_DATABASE).forEach(([muscleGroup, categoryData]) => {
        if (categoryData.exercises && Array.isArray(categoryData.exercises)) {
            categoryData.exercises.forEach(exercise => {
                exercisesToInsert.push({
                    exercise_id: exercise.id,
                    name: exercise.name,
                    muscle_group: muscleGroup,
                    equipment: exercise.equipment,
                    instructions: exercise.instructions || null
                })
            })
        }
    })

    const { error: exError } = await supabase
        .from('global_exercises')
        .upsert(exercisesToInsert, { onConflict: 'exercise_id' })

    if (exError) {
        console.error('❌ Error al insertar ejercicios:', exError)
    } else {
        console.log(`✅ ${exercisesToInsert.length} ejercicios insertados\n`)
    }

    console.log('🎉 ¡Datos globales poblados exitosamente!')
}

populateGlobalData().catch(console.error)
