<template>
  <div class="popup">
    <div class="pop-inner">
      <div class="heading">
        <div class="row">
          <div class="col-10">
            <h3 class="">Enter your Passage</h3>
          </div>
          <div class="col-2 cross-button">
            <span @click="close()">
              <ion-icon name="close" style="font-size: 25px"></ion-icon>
            </span>
          </div>
        </div>
      </div>
        <div class="textArea">
            <textarea name="passage" v-model="passage" rows="17" cols="">Enter text here...</textarea>
        </div>
        <div class="submitBtn">
            <button type="button" class="btn btn-primary" @click="submit">Submit</button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props:['passage'],
  components: {},
  data() {
    return {
      passages:'',
    };
  },
  created(){
      this.passages = this.passage;
  },
  methods: {
    submit() {
        this.$emit("submit-passage",this.passages);
    },
    close() {
      this.$emit("close-popup");
    },
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  padding-top: 50px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}
.pop-inner {
  margin-top: 0;
  margin-right: 0;
  margin-left: 0;
  height: 85%;
  width: 50%;
  background: #fff;
  border-radius: 15px;
  padding: 20px;
}
.textArea {
    width: 100%;
    margin-top: 10px;
    text-align: center;
}
.textArea textarea {
    width: 100%;
}
.submitBtn {
    margin-top: 10px;
    text-align: center;
}
.cross-button {
  text-align: right;
}
@media only screen and (max-width: 767px) {
  .pop-inner {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .textArea{
    margin-top: 30px;
  }
  .textArea textarea {
    border: 1px solid black;
  }
}
@media only screen and (max-width: 767px) {
  .popup {
    padding-top: 0;
  }
}
</style>
