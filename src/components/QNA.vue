<template>
  <div class="mainContainer">
    <div class="main">
      <div v-if="showPopup">
        <AkbarPopup
          :passage="passage"
          v-on:submit-passage="submit"
          v-on:close-popup="closepopup"
        />
      </div>
      <div class="leftSide" v-bind:class="showClass ? 'active' : ''">
        <div class="header">
          <div class="userImg">
            <img src="../assets/user.png" class="cover" />
          </div>
          <ul class="nav_icons">
            <li><ion-icon name="scan-circle-outline"></ion-icon></li>
            <li><ion-icon name="chatbox"></ion-icon></li>
            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
          </ul>
        </div>
        <!-- Search  -->
        <div class="search-chat">
          <div>
            <input
              type="text"
              placeholder="Search or start new chat"
              id="search"
              @input="search"
            />
            <ion-icon name="search-outline"></ion-icon>
          </div>
        </div>
        <!-- Chat list -->

        <div v-for="(expert, index) in experts" :key="index">
          <div class="chatList" v-if="filtersShow === false">
            <div
              class="block"
              @click="selectUser(expert.name)"
              :class="{ selectUser: expert.name === user }"
            >
              <div class="imgbox">
                <img src="../assets/user.png" class="cover" />
              </div>
              <div class="details">
                <div class="listHead">
                  <h4>{{ expert.name }}</h4>
                   <p class="time2">{{ expert.time }}</p>
                </div>
               <div class="message-p">
                 <p>Hello</p>
                 <b v-if="expert.len>0">{{expert.len}}</b>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div v-for="filter in filters" :key="filter.name">
          <div class="chatList">
            <div
              class="block"
              @click="selectUser(filter.name)"
              :class="{ selectUser: filter.name === user }"
            >
              <div class="imgbox">
                <img src="../assets/user.png" class="cover" />
              </div>
              <div class="details">
                <div class="listHead">
                  <h4>{{ filter.name }}</h4>
                  
                  <p class="time">{{ filter.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>





      
         <div class="rightSide" v-bind:class="showClass ? 'non' : 'active'">
        <div class="header" v-if="user">
          <div class="userText">
            <ion-icon @click="back" name="arrow-back-outline"></ion-icon>
            <div class="userImg">
              <img src="../assets/user.png" class="cover" />
            </div>
            <h4>
              {{ user }} <br /><span>{{ status }}</span>
            </h4>
          </div>
          
          <ul class="nav_icons" v-if="user">
            <li><ion-icon @click="upload" name="push-outline"></ion-icon></li>
            <li><ion-icon name="search-outline"></ion-icon></li>
            <li><ion-icon name="ellipsis-vertical"></ion-icon></li>
          </ul>
        </div>
        <!-- chat box -->
        <div id='chatboxid' class="chatbox" v-chat-scroll v-if="user">
          <div v-for="(ques, indx) in questionHistory" :key="indx">
            <div class="message my_message" v-if="ques.user === user">
              <p>
                {{ ques.question }} <span>{{ ques.time }}</span>  
              </p>
            </div>
            <div class="message server_message" v-if="ques.user === user">
              <p class="hello" v-if="ques.ans1 == ''">
                <span class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </span>
              </p>
              <p class="hello" v-if="ques.ans1 !== '' && ques.user === user">
                {{ ques.ans1 }} <span>{{ ques.time }}</span>
              </p>
            </div>
            <div class="message server_message" v-if="ques.ans2 !== '' && ques.user === user">
              <p>
                {{ ques.ans2 }} <span>{{ ques.time }}</span>
              </p>
            </div>
            <div class="message server_message" v-if="ques.ans3 !== '' && ques.user === user">
              <p>
                {{ ques.ans3 }} <span>{{ ques.time }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- chat input box -->
        <div class="chatbox_input" v-if="user">
          <ion-icon name="happy-outline"></ion-icon>
          <ion-icon name="attach-outline"></ion-icon>
          <input
            id="data"
            type="text"
            v-model="model"
            @input="sendBtnCheck"
            v-on:keyup.enter="saveItem"
            placeholder="Type here ... "
          />
          <ion-icon v-if="send" name="send" @click="saveItem"></ion-icon>
          <ion-icon v-if="send === false" name="mic"></ion-icon>
        </div>
      </div>
    </div>
            <!-- <button v-scroll-to="'#chatboxid'">
            Scroll to #chatboxid
          </button> -->
 
  


          
  </div>
  
</template>

<script>
import AkbarPopup from "./QNApopup.vue";
export default {
  components: {
    AkbarPopup,
  },
  data() {
    return {
      showBackIcon: false,
      showClass: false,
      filtersShow: false,
      send: false,
      filters: [],
      experts: [
        { name: "Akbar", time: "",len: "" },
        { name: "Mount Everest", time: "",len: "" },
        { name: "NASA", time: "",len: "" },
        { name: "History Of Computer", time: "",len: "" },
        { name: "History Of India", time: "",len: "" },
          { name: "Apple", time: "",len: "" },
          { name: "ISRO", time: "",len: "" },
      ],
      status: "",
      user: "",
      akbar: "",
      nasa: "",
      isro: "",
      historyOfcomp: "",
      historyofindia: "",
       apple: "",
      mountet: "",
      model: "",
      questionHistory: [],
      questionHistory1: [],
      count:0,
      data: "",
      loader: false,
      showPopup: false,
      passage: "",
       Apple: 
       "Apple Computers, Inc. was founded on April 1, 1976, by college dropouts Steve Jobs and Steve Wozniak, who brought to the new company a vision of changing the way people viewed computers. Jobs and Wozniak wanted to make computers small enough for people to have them in their homes or offices.",
      Akbar:
        "Akbar the Great was born on 07 October 1542, at the Rajput Fortress of Umerkot in Sindh. He was the son of Humayun and his wife Hamida Banu Begum. Akbar was born at a time when his parents were in exile. Akbar spent his entire childhood learning how to fight and hunt. He had no interest in learning how to read and write. However, Akbar was the only Moghul Emperor who was illiterate and still had a penchant for knowledge.Akbar was made king at the age of 13, after the death of his father. Akbar was with Bairam Khan at the time of his father’s passing and Bairam was made Regent, as Akbar was too young. On many occasions Bairam led campaigns on Akbar’s behalf to expand the kingdom.Hemu, the Hindu minister of an Afghan Prince, Adil Shah, was waiting for a chance to defeat Akbar. Hemu attacked the kingdom of Delhi and emerged victorious, crowning himself ruler of Delhi. Akbar launched a scathing attack in the Second Battle of Panipat. The two armies fought valiantly and it seemed as the Moghuls were fighting a losing battle until an arrow hit Hemu’s eye and he fainted. Hemu’s men thought that he was dead and put down their weapons, accepting defeat. Akbar became king again. As Akbar grew older, he won many more battles and added more regions to his kingdom, stretching from the Indo-Ganges Basin to Kashmir and Afghanistan, all the way down to Bengal in the east and part of Deccan in the south.Although Akbar was a young king, he was a shrewd and organised. He got rid of all his ministers who he felt were too ambitious and were looking to covet his position. He removed restrictions on religions and allowed his people to practice the religion of their choice, without having to fear for their life.Akbar was fair to his people and abolished unfair taxes on non-Muslims. He also played an important role in bringing in social reforms such as the abolishment of child marriage, permission for widows to re-marry and the removal of bans to build Hindu temples.Although illiterate, Akbar was surrounded by scholars such as Birbal, Abul Fazl and Tansen who were all part of the Nine Gems or Navaratnas. Akbar took keen interest in religion, music, painting, poetry and philosophy.He had a huge collecting of books and manuscripts and was also the owner of a number of artworks from across the region. His biggest accomplishment however, lay in architecture. He built great structures like the Jama Masjid that stands tall even today. He even built a palace for his wife close to the Hawa Mahal.Akbar fathered three sons, Jahangir, Murad and Daniyal. Jahangir was the only surviving son as the other two died very young. Jahangir and Akbar did not share a very good relationship and were at constant logger-heads with each other.In 1605, Akbar fell very ill and died a slow death. He had managed to bring parts of East, West, North as well as South India under his rule. Akbar’s rule is greatly noted for the wealth of learning and culture that existed in his time. He was also admired for his bravery and wisdom.",
      HistoryOfComputer:
        "Charles Babbage, an English mechanical engineer and polymath, originated the concept of a programmable computer. Considered the 'father of the computer', he conceptualized and invented the first mechanical computer in the early 19th century.The history of computers goes back over 200 years. At first theorized by mathematicians and entrepreneurs, during the 19th century mechanical calculating machines were designed and built to solve the increasingly complex number-crunching challenges. The advancement of technology enabled ever more-complex computers by the early 20th century, and computers became larger and more powerful.Today, computers are almost unrecognizable from designs of the 19th century, such as Charles Babbage's Analytical Engine — or even from the huge computers of the 20th century that occupied whole rooms, such as the Electronic Numerical Integrator and Calculator.Here is a brief history of computers, from their primitive number-crunching origins to the powerful modern-day machines that surf the Internet, run games and stream multimedia.",
      MountEverest:
        "Mount Everest, Sanskrit and Nepali Sagarmatha, Tibetan Chomolungma, Chinese (Pinyin) Zhumulangma Feng or (Wade-Giles romanization) Chu-mu-lang-ma Feng, also spelled Qomolangma Feng, mountain on the crest of the Great Himalayas of southern Asia that lies on the border between Nepal and the Tibet Autonomous Region of China, at 27°59′ N 86°56′ E. Reaching an elevation of 29,032 feet (8,849 metres), Mount Everest is the highest mountain in the world.Like other high peaks in the region, Mount Everest has long been revered by local peoples. Its most common Tibetan name, Chomolungma, means “Goddess Mother of the World” or “Goddess of the Valley.” The Sanskrit name Sagarmatha means literally “Peak of Heaven.” Its identity as the highest point on the Earth’s surface was not recognized, however, until 1852, when the governmental Survey of India established that fact. In 1865 the mountain—previously referred to as Peak XV—was renamed for Sir George Everest, British surveyor general of India from 1830 to 1843.The Himalayan ranges were thrust upward by tectonic action as the Indian-Australian Plate moved northward from the south and was subducted (forced downward) under the Eurasian Plate following the collision of the two plates between about 40 and 50 million years ago. The Himalayas themselves started rising about 25 to 30 million years ago, and the Great Himalayas began to take their present form during the Pleistocene Epoch (about 2,600,000 to 11,700 years ago). Everest and its surrounding peaks are part of a large mountain massif that forms a focal point, or knot, of this tectonic action in the Great Himalayas. Information from global positioning instruments in place on Everest since the late 1990s indicates that the mountain continues to move a few inches to the northeast and rise a fraction of an inch each year.Everest is composed of multiple layers of rock folded back on themselves (nappes). Rock on the lower elevations of the mountain consists of metamorphic schists and gneisses, topped by igneous granites. Higher up are found sedimentary rocks of marine origin (remnants of the ancient floor of the Tethys Sea that closed after the collision of the two plates). Notable is the Yellow Band, a limestone formation that is prominently visible just below the summit pyramid.The barren Southeast, Northeast, and West ridges culminate in the Everest summit; a short distance away is the South Summit, a minor bump on the Southeast Ridge with an elevation of 28,700 feet (8,748 metres). The mountain can be seen directly from its northeastern side, where it rises about 12,000 feet (3,600 metres) above the Plateau of Tibet. The peak of Changtse (24,803 feet [7,560 metres]) rises to the north. Khumbutse (21,867 feet [6,665 metres]), Nuptse (25,791 feet [7,861 metres]), and Lhotse (27,940 feet [8,516 metres]) surround Everest’s base to the west and south.Everest is shaped like a three-sided pyramid. The three generally flat planes constituting the sides are called faces, and the line by which two faces join is known as a ridge. The North Face rises above Tibet and is bounded by the North Ridge (which meets the Northeast Ridge) and the West Ridge; key features of this side of the mountain include the Great and Hornbein couloirs (steep gullies) and the North Col at the start of the North Ridge. The Southwest Face rises above Nepal and is bounded by the West Ridge and the Southeast Ridge; notable features on this side include the South Col (at the start of the Southeast Ridge) and the Khumbu Icefall, the latter a jumble of large blocks of ice that has long been a daunting challenge for climbers. The East Face—or Kangshung (Kangxung) Face—also rises above Tibet and is bounded by the Southeast Ridge and the Northeast Ridge.The summit of Everest itself is covered by rock-hard snow surmounted by a layer of softer snow that fluctuates annually by some 5–20 feet (1.5–6 metres); the snow level is highest in September, after the monsoon, and lowest in May after having been depleted by the strong northwesterly winter winds. The summit and upper slopes sit so high in the Earth’s atmosphere that the amount of breathable oxygen there is one-third what it is at sea level. Lack of oxygen, powerful winds, and extremely cold temperatures preclude the development of any plant or animal life there.Glaciers cover the slopes of Everest to its base. Individual glaciers flanking the mountain are the Kangshung Glacier to the east; the East, Central, and West Rongbuk (Rongpu) glaciers to the north and northwest; the Pumori Glacier to the northwest; and the Khumbu Glacier to the west and south, which is fed by the glacier bed of the Western Cwm, an enclosed valley of ice between Everest and the Lhotse-Nuptse Ridge to the south. Glacial action has been the primary force behind the heavy and continuous erosion of Everest and the other high Himalayan peaks.",
      NASA: "The National Aeronautics and Space Administration (NASA) is an independent agency of the U.S. federal government responsible for the civilian space program, as well as aeronautics and space research.[note 1]NASA was established in 1958, succeeding the National Advisory Committee for Aeronautics (NACA). The new agency was to have a distinctly civilian orientation, encouraging peaceful applications in space science.[7][8][9] Since its establishment, most US space exploration efforts have been led by NASA, including the Apollo Moon landing missions, the Skylab space station, and later the Space Shuttle. NASA is supporting the International Space Station and is overseeing the development of the Orion spacecraft, the Space Launch System, Commercial Crew vehicles, and the planned Lunar Gateway space station. The agency is also responsible for the Launch Services Program, which provides oversight of launch operations and countdown management for uncrewed NASA launches.NASA's science is focused on better understanding Earth through the Earth Observing System;[10] advancing heliophysics through the efforts of the Science Mission Directorate's Heliophysics Research Program;[11] exploring bodies throughout the Solar System with advanced robotic spacecraft such as New Horizons;[12] and researching astrophysics topics, such as the Big Bang, through the Great Observatories and associated programs.",
       ISRO: "The Indian Space Research Organization (ISRO) is the pioneer space exploration agency of the Government of India, headquartered at Bengaluru. ISRO was formed in 1969 with a vision to develop and harness space technology in national development, while pursuing planetary exploration and space science research. ISRO replaced its predecessor, INCOSPAR (Indian National Committee for Space Research), established in 1962 by India’s first Prime Minister Pt. Jawaharlal Nehru and scientist Vikram Sarabhai, considered amongst the founding fathers of Indian space program.",
      
       HistoryOfIndia:
       "Capital of India is New Delhi.In December 1911 King George V of Britain decreed that the capital of British India would be moved from Calcutta (now Kolkata) to Delhi. Construction began in 1912 at a site about 3 miles (5 km) south of the Delhi city centre, and the new capital was formally dedicated in 1931. The straight and diagonal pattern of the broad tree-lined avenues in New Delhi, with extensive green spaces and wide vistas, contrasts sharply with the crowded, narrow, and winding streets characteristic of Old Delhi. The main east-west axis of New Delhi is Central Vista Park, which is flanked by government buildings, museums, and research centres in a parklike setting. The city is governed by the appointed New Delhi Municipal Council (NDMC). Area city, 16.5 square miles (42.7 square km). Pop (2001) 302,363."
    };


  },

  methods: {
    closepopup() {
      this.showPopup = false;
    },
    upload() {
     // console.log ("User",this.passage)
      if (this.user === "Akbar") {
        this.passage = this.Akbar;
        this.showPopup = true;
      } else if (this.user === "NASA") {
        this.passage = this.NASA;
        this.showPopup = true;
      } else if (this.user === "Mount Everest") {
        this.passage = this.MountEverest;
        this.showPopup = true;
      } else if (this.user === "History Of Computer") {
        this.passage = this.HistoryOfIndia;
        this.showPopup = true;
      }
      else if (this.user === "") {
        this.passage = this.HistoryOfComputer;
        this.showPopup = true;
      }
      else if (this.user === "ISRO") {
        this.passage = this.ISRO;
        this.showPopup = true;
      }
       else if (this.user === "Apple") {
        this.passage = this.Apple;
        this.showPopup = true;
      }
    },
    submit(passage) {
      console.log("pasg",this.Akbar)
      if (passage === "") {
        //
      } else if (this.user === "Akbar") {
        this.Akbar = passage;
        this.showPopup = false;
      } else if (this.user === "NASA") {
        this.NASA = passage;
        this.showPopup = false;
      } else if (this.user === "Mount Everest") {
        this.MountEverest = passage;
        this.showPopup = false;
      } else if (this.user === "History Of Computer") {
        this.HistoryOfComputer = passage;
        this.showPopup = false;
      }else if (this.user === "ISRO") {
        this.ISRO = passage;
        this.showPopup = false;
      }else if (this.user === "Apple") {
        this.Apple = passage;
        this.showPopup = false;
      }
      else if (this.user === "History Of India") {
        this.HistoryOfIndia = passage;
        this.showPopup = false;
      }
    },
    addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    findTime() {
      const currentDate = new Date();
      const hours = this.addZero(currentDate.getHours());
      const minutes = this.addZero(currentDate.getMinutes());
      const time = hours + ":" + minutes;
      return time;
    },
    sendBtnCheck() {
      let typedMessage = document.getElementById("data").value;
      console.log(typedMessage)             /* type message */
      console.log(this.user)                /* user name= akbar */

      if (typedMessage !== "") {
        this.send = true;
        if (this.user === "Akbar") {
          this.akbar = typedMessage;
        } else if (this.user === "NASA") {
          this.nasa = typedMessage;
        } else if (this.user === "Mount Everest") {
          this.mountet = typedMessage;
        } else if (this.user === "History Of Computer") {
          this.historyOfcomp = typedMessage;
        }
        else if (this.user === "ISRO") {
          this.isro = typedMessage;
        }
         else if (this.user === "Apple") {
          this.apple = typedMessage;
        }
         else if (this.user === "History Of India") {
          this.historyofindia = typedMessage;
        }
      } else {
        this.send = false;
      }
    },
    search() {
      let searchValue = document.getElementById("search").value;
      if (searchValue === "") {
        this.filtersShow = false;
      } else {
        this.filtersShow = true;
      }
      this.filters = this.experts.filter((ele) => {
        return ele.name === searchValue;
      });
    },
    back() {
      this.showClass = !this.showClass;
    },
    selectUser(user) {
      console.log({user})

      this.showClass = !this.showClass;
      this.status = "Online";
      this.user = user;
      this.user1 = "";
      if (user === "Akbar") {
        this.model = this.akbar;
      console.log("Select User",this.akbar)

      } else if (this.user === "NASA") {
        this.model = this.nasa;
      } else if (this.user === "Mount Everest") {
        this.model = this.mountet;
      } else if (this.user === "History Of Computer") {
        this.model = this.historyOfcomp;
      }
       else if (this.user === "ISRO") {
        this.model = this.isro;
      }
      else if (this.user === "Apple") {
        this.model = this.apple;
      }
      else if (this.user === "History Of India") {
        this.model = this.historyofindia;
      }
    },

    async saveItem() {
      //console.log("save",user)
      const qna = require("@tensorflow-models/qna");
        console.log("qna",qna)

      if (this.user === "") {
        //
        console.log("mnmm",this.user)
      } else if (this.user === "History Of Computer") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        console.log("typedMessage",typedMessage)
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        console.log("newQues",newQues)
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.historyOfcomp = "",
          qna.load().then((model) => {
            // Find the answers
            model.findAnswers(typedMessage, this.HistoryOfComputer).then((answers) => {
              let len = this.questionHistory.length;
               this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
              console.log("len",len)
            if (answers.length > 0) {

              if (answers.length > 1) {
                if (answers.length > 2) {
                    console.log("len",answers.length)
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
            });
          });
      } else if (this.user === "Mount Everest") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.mountet = "";
        qna.load().then((model) => {
          // Find the answers
          model.findAnswers(typedMessage, this.MountEverest).then((answers) => {
            let len = this.questionHistory.length;
             this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        });
      }
      /////////////////////////////ISRO////////////////////////
      else if (this.user === "ISRO") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.isro = "";
        qna.load().then((model) => {
          // Find the answers
          model.findAnswers(typedMessage, this.ISRO).then((answers) => {
            let len = this.questionHistory.length;
             this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        });
      }
      
     //////////////////////////////////////NASA/////////////////////////////// 
      else if (this.user === "NASA") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.nasa = "";
        qna.load().then((model) => {
          // Find the answers
          model.findAnswers(typedMessage, this.NASA).then((answers) => {
            let len = this.questionHistory.length;
             this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        });
      } 
      ///////////////////////////////////Apple///////////////////////////
      else if (this.user === "Apple") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.akbar = "";
        qna.load().then((model) => {
          model.findAnswers(typedMessage, this.Apple).then((answers) => {
            let len = this.questionHistory.length;
             this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                  } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        }); 
      }
      /////////////////////////////////History Of India///////////////////
      else if (this.user === "History Of India") {
        let time = this.findTime();
        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        this.questionHistory.push(newQues);
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.historyofindia = "";
        qna.load().then((model) => {
          // Find the answers
          model.findAnswers(typedMessage, this.HistoryOfIndia).then((answers) => {
            let len = this.questionHistory.length;
              this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
             console.log("qus India",this.questionHistory)
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        });
      }

     ///////////////////////////////////////AKBAR////////////////////////////    

      else if (this.user === "Akbar") {
        let time = this.findTime();
       // let len1=this.questionHistory.length;
      //  console.log("len1",len1)
        console.log("time",time)

        this.experts.map((timeObject) => {
          if (timeObject.name === this.user) {
            timeObject.time = time;
          //  timeObject.len1 = len1;
          }
        });
        let typedMessage = document.getElementById("data").value;
        let newQues = {
          user: this.user,
          question: typedMessage,
          ans1: "",
          ans2: "",
          ans3: "",
          time: time,
        };
        console.log("newQues",newQues)
        this.questionHistory.push(newQues);
     //   console.log("newQues2",this.questionHistory.push)
        this.loader = true;
        document.getElementById("data").value = "";
        this.model = "";
        this.akbar = "";
        qna.load().then((model) => {
          model.findAnswers(typedMessage, this.Akbar).then((answers) => {
            let len = this.questionHistory.length;
//console.log("qushistory"(this.questionHistory))
             this.experts.map((timeObject2) => {
          if (timeObject2.name === this.user) {
            console.log("qve",this.questionHistory)
            timeObject2.len = len;
          //  timeObject.len1 = len1;
          }
        });
            console.log("len",len)
            if (answers.length > 0) {
              if (answers.length > 1) {
                if (answers.length > 2) {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                  this.questionHistory[len - 1].ans3 = answers[2].text;
                  } else {
                  this.questionHistory[len - 1].ans1 = answers[0].text;
                  this.questionHistory[len - 1].ans2 = answers[1].text;
                }
              } else {
                this.questionHistory[len - 1].ans1 = answers[0].text;
              }
            } else {
              this.questionHistory[len - 1].ans1 = "Sorry! No Answer";
            }
            this.loader = false;
            this.send = false; 
          });
        }); 
      }
      
    },
  },
};
//console.log(expert)
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Open Sans", sans-serif;
}
.mainContainer {
  display: flex;
  justify-content: center;
  align-items: center;
 /* min-height: 100vh;  */

  background: linear-gradient(
   
    #d9dbd5 130px,
    #d9dbd5 100%
  );
}
.noti-time{
    width: auto;   
   display: flex;
}
.container-noti{
  
  margin-right: 10px;
}
.time{
  padding-right: 8px;
  padding-bottom: 2px;
}

.notification{
  width: 20px;
  background:#00c853;
  color: rgb(234, 241, 236);
  border-radius: 10px;
  text-align: center;
  margin-right: 1px;
 

}


.main {
  position: relative;  
  width: 150%;
  
  margin: 0 auto 0;
  max-width: 100%;
  height: calc(106vh - 40px);
  background: #ffff; 
 
 
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.06);
  display: flex;
}
.main .leftSide {
  position: relative;
  width: 30%;
  flex: 30%;
  background: #ffff;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}
.main .rightSide {
  position: relative;
  width: 70%;
 
  flex: 70%;
  background: #e5ddd5;  
 /*background-image: url("/src/assets/welcome-placeholder.jpeg") ;
 background-size: 200px;   */
 
}

.header {
  position: relative;
  width: 100%;
  height: 60px;
  background: #ededed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}
.userImg {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
 
}
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
 
}
.nav_icons {
  display: flex;
}
.nav_icons li {
  display: flex;
  list-style: none;
  cursor: pointer;
  color: #51585c;
  font-size: 1.5em;
  margin-left: 22px;
}
.search-chat {
  position: relative;
  width: 100%;
  height: 55px;
 background:#fdf9f2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px ;
  border: solid 1px #e0e4e8;
 
  
}
.search-chat div {
  width: 100%;
 
}
.search-chat div input {
  width: 100%;
  outline: none;
  border: none;
 
  padding: 6px;
  height: 38px;
  border-radius:10px;
  font-size: 14px;
  padding-left: 40px;
 
   background:#e0dedb;
}
.search-chat div input::placeholder {
  color: rgb(141, 134, 134);
 padding-left: 14px;
}
.search-chat div ion-icon {
  position: absolute;
  left: 30px;
  top: 17px;
  font-size: 1.2em;
}
.chatList {
  position: relative;
  height: calc(100% - 110px);
  overflow-y: auto;
 
  /* background: #ff0; */
}
.chatList .block {
  position: relative;
  width: 100%;
  display: flex;
 /* justify-content: center;  */
  align-items: center;    
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  
  
}


.selectUser {
  background: #f5f5f5;

}
.chatList .block .imgbox {
  position: relative;
  min-width: 45px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 10px;
}
.chatList .block .details {
  position: relative;
  width: 100%;                        /*  50%   */
 
  
 
}
.chatList .block .details .listHead {
  display: flex;
/*  margin-left: 18px;   */

 justify-content: space-between;  
  /* border: 1px solid red;   */

margin-bottom: 0px;
}
.chatList .block .details .listHead h4 {
  font-size: 1em;
  font-weight: 600;     /*bold  */
  padding: 5px;
 /* font-weight: 100;   */
  color: rgb(27, 22, 22);
 /* margin-right: 30px;  */

}
.chatList .block .details .listHead .time2 {
  font-size: 0.75em;
  color: #aaa;
  margin-right:2px;
  margin-top: 8px;
}
.message-p{
  display: flex;
  justify-content: space-between;
  align-items: center;


}
.message-p p{
  color: #aaa;
 margin-left: 5px;
  display:-webkit-box;
  -webkit-line-clamp: 1;
  font-size: 0.9em;
  -webkit-background-orient: vertical ;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-p b{
  background: #06d755;
  color: #fff;
  min-width: 20px;
  width: auto;
  height: auto;   
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75em;
  margin-right: 5px; 
  padding:2px ;
  
}

/* right Side */
.userText {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.userText ion-icon {
  font-size: 25px;
  font-weight: 500;
  margin-right: 10px;
  display: none;
  
}
.userText h4 {
  font-size: 15px;
  font-weight: 500;
  margin-left: 15px;
  
}
.userText span {
  font-size: 0.8em;
  color: #555;
}

.chatbox {
  position: relative;
  width: 100%;
  height: calc(100% - 135px);
  padding: 5px 30px;
  overflow-y: auto;
  background-image: url(https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg) ;
}
.message {
  position: relative;
  display: flex;
  width: 100%;

  margin: 5px 0;
}
.message p {
  position: relative; 
  text-align: left;
  max-width: 65%;
  
  padding: 6px 7px 8px 9px;
  background: #dcf8c6;
  border-radius: 10px;
  font-size: 0.9em;
  display: block;
}
.my_message p::before {
  content: "";
  position: absolute;
  top: 0;
  right: -12px;
  width: 20px;
  height: 20px;
  background: linear-gradient(
    135deg,
    #dcf8c6 0%,
    #dcf8c6 50%,
    transparent 50%,
    transparent
  );
}

.message span {
  float: right;
  margin: 10px 0 -10px 35px;
  font-size: 0.85em;
  opacity: 0.5;
  padding: 0;
}
.my_message {
  justify-content: flex-end;
}
.server_message {
  justify-content: flex-start;
}
.server_message p {
  background: #fff;
  text-align: left;
}
.server_message .hello::before {
  content: "";
  position: absolute;
  top: 0;
  left: -12px;
  width: 20px;
  height: 20px;
  background: linear-gradient(
    225deg,
    #fff 0%,
    #fff 50%,
    transparent 50%,
    transparent
  );
}
.chatbox_input {
  position: relative;
  width: 100%;
  background: #f0f0f0;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chatbox_input ion-icon {
  cursor: pointer;
  font-size: 1.8em;
  color: #51585c;
}
.chatbox_input ion-icon:nth-child(1) {
  margin-right: 15px;
}
.chatbox_input input {
  position: relative;
  width: 90%;
  margin: 0 20px;
  padding: 10px 20px;
  border: none;
  outline: none;
  font-size: 1em;
  border-radius: 30px;
}

/* dot loader */
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 30px;
}
.lds-ellipsis div {
  position: absolute;

  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: black;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

/* dot loader end */

@media only screen and (max-width: 600px) {
  .main {
    margin: 0px;
    width: 100%;
    height: calc(100vh - 0px);
    border: none;
  }
  .main .leftSide {
    border-right: none;
   
  }
  .active {
    display: none;
  
  }
  .on{
    background: skyblue;
  }
  .rightSid{
    background: skyblue;
    width: 100vh;
  }
  .m1{
    color:tomato;
  }
  .userText ion-icon {
    display: flex;
  }
}
</style>