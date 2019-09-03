<template>
  <div class="container edit-smoothie">
    <div v-if="smoothie">
      <h2>Edit {{ smoothie.title }} smoothie</h2>

      <form @submit.prevent="updateSmoothie">
        <div class="field title">
          <label for="title">Title:</label>
          <input type="text" name="title" v-model="smoothie.title" />
        </div>
        <div
          v-for="(ingredient, index) in smoothie.ingredients"
          :key="index"
          class="field"
        >
          <label for="ingredient">Ingredient:</label>
          <input
            type="text"
            name="ingredient"
            v-model="smoothie.ingredients[index]"
          />
          <i class="material-icons delete" @click="deleteIngredient(ingredient)"
            >delete</i
          >
        </div>
        <div class="field add-ingredient">
          <label for="add-ingredient">Add an ingredients:</label>
          <input
            type="text"
            name="add-ingredient"
            @keydown.tab.prevent="addIngredient"
            v-model="newIngredient"
          />
        </div>
        <div class="field center-align">
          <p class="red-text" v-if="feedback">{{ feedback }}</p>
          <button type="submit" class="btn pink">Update Smoothie</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import slugify from "slugify";
import db from "../firebase/init";

export default {
  name: "EditSmoothie",
  data() {
    return {
      smoothie: null,
      newIngredient: "",
      feedback: ""
    };
  },
  methods: {
    addIngredient() {
      if (this.newIngredient && this.newIngredient.length > 0) {
        this.smoothie.ingredients.push(this.newIngredient);
        this.newIngredient = "";
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add an ingredient";
      }
    },
    deleteIngredient(ingredientToDelete) {
      this.smoothie.ingredients = this.smoothie.ingredients.filter(
        ingredient => {
          return ingredient !== ingredientToDelete;
        }
      );
    },
    updateSmoothie() {
      if (
        this.smoothie.title &&
        this.smoothie.title.length !== 0 &&
        this.smoothie.ingredients.length !== 0
      ) {
        this.feedback = null;
        this.smoothie.slug = slugify(this.smoothie.title, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });

        db.collection("smoothies")
          .doc(this.smoothie.id)
          .update({
            title: this.smoothie.title,
            ingredients: this.smoothie.ingredients,
            slug: this.smoothie.slug
          })

          .then(() => {
            this.$router.push({ name: "home" });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (this.title && this.title.length === 0) {
          this.feedback = "You must enter a title for the smoothie";
        } else if (this.ingredients.length === 0) {
          this.feedback = "You must add ingredients to the smoothie";
        }
      }
    }
  },
  created() {
    const ref = db
      .collection("smoothies")
      .where("slug", "==", this.$route.params.slug);

    ref
      .get()
      .then(snapshots => {
        snapshots.forEach(document => {
          this.smoothie = document.data();
          this.smoothie.id = document.id;
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.edit-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;

  h2 {
    font-size: 2em;
    margin: 20px auto;
  }

  .field {
    margin: 20px auto;
    position: relative;
  }

  .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
  }
}
</style>
