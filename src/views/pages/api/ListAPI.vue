<template>
  <div style="background: #fdfdfd; padding-bottom: 100px">
    <div
      v-for="(_apis, apisIndex) in apis"
      apigroup
      :key="`apis-${apisIndex}`"
      class="font-sans-serif w-94"
    >
      <h2 class="animate__shakeY">Audio API</h2>
      <div>Base: {{ _apis.baseURL }}</div>
      <div
        v-for="api in _apis.apis"
        :key="`api-${api.id}`"
        class="card api mt-8"
      >
        <div
          class="api__title p-4"
          :class="{ 'api__title--isOpen': api.isOpen }"
          @click="api.isOpen = !api.isOpen"
        >
          <div class="block primary mr-2">{{ api.type }}</div>
          <div class="mr-2">
            <b>{{ api.url }}</b>
          </div>
          <div class="mr-2">{{ api.description }}</div>
        </div>
        <div v-show="api.isOpen">
          <div class="api__params">
            <div class="api__params--header p-6 py-3">
              <div>Parameters</div>
              <button
                class="btn"
                :class="{ 'btn-danger': api.isExecute }"
                @click="
                  api.isExecute = !api.isExecute;
                  api.response = null;
                "
              >
                {{ api.isExecute ? "Cancel" : "Try it out" }}
              </button>
            </div>
            <div class="api__params--content py-3">
              <table :class="{ 'no-divide': api.params.length == 0 }">
                <thead style="border-bottom: 1px solid rgba(59, 65, 81, 0.2)">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(param, paramIndex) in api.params"
                    :key="`api-param-${api.id}-${paramIndex}`"
                  >
                    <td>
                      <div
                        style="color: #176bc1"
                        class="mb-1"
                        :class="{ required: param.required }"
                      >
                        {{ param.name }}
                      </div>
                      <i>({{ param.type }})</i>
                    </td>
                    <td>
                      <div v-if="!api.isExecute">{{ param.description }}</div>
                      <input
                        v-if="api.isExecute"
                        :placeholder="`${param.name}-${param.type}`"
                        class="mt-2 p-2"
                        :class="{
                          invalid:
                            param.required && !param.value && api.isValidated,
                          animate__shakeY:
                            param.required && !param.value && api.isValidated,
                        }"
                        @focus="api.isValidated = false"
                        v-model="param.value"
                      />
                      <div
                        class="invalid-helper"
                        v-if="param.required && !param.value && api.isValidated"
                      >
                        {{ param.name }} is required field
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" v-show="api.isExecute">
                      <div class="d-flex api__execute">
                        <div
                          class="w-100 is-btn text-center api__execute--control primary"
                          @click="executeAPI(apisIndex, api.id)"
                        >
                          Execute
                        </div>
                        <div
                          class="w-100 is-btn text-center api__execute--control success"
                          @click="executeDefaultValue(apisIndex, api.id)"
                        >
                          Test Default
                        </div>
                        <div
                          class="w-100 is-btn text-center api__execute--control"
                          @click="resetParams(apisIndex, api.id)"
                        >
                          Clear
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="api__response">
            <div class="api__response--header">
              <p class="m-2">Responses</p>
            </div>
            <div class="api__response--content p-6 mt-2">
              <h4>Request URL</h4>
              <pre class="round-4 text-left p-3">{{
                generateRequestURL(apisIndex, api.id)
              }}</pre>
              <h4 class="mt-2">Server response</h4>
              <div v-if="api.isExecuting">
                <svg
                  style="
                    margin: auto;
                    background: none;
                    display: block;
                    shape-rendering: auto;
                  "
                  width="80px"
                  height="80px"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    fill="none"
                    stroke="#8a8383"
                    stroke-width="8"
                    stroke-dasharray="42.76482137044271 42.76482137044271"
                    d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                    stroke-linecap="round"
                    style="transform: scale(0.8); transform-origin: 50px 50px"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      repeatCount="indefinite"
                      dur="1s"
                      keyTimes="0;1"
                      values="0;256.58892822265625"
                    ></animate>
                  </path>
                </svg>
              </div>
              <table class="no-divide text-left" v-if="api.response">
                <thead style="border-bottom: 1px solid rgba(59, 65, 81, 0.2)">
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="vertical-align: baseline">
                      <div class="mb-1 py-3">
                        <span class="text-uppercase">{{
                          api.response.type
                        }}</span
                        ><br />
                        <small
                          ><i>({{ api.response.message }})</i></small
                        >
                      </div>
                    </td>
                    <td class="py-2">
                      <small>Response body</small><br />
                      <pre class="mt-1 p-3 round-4">{{
                        JSON.stringify(api.response, null, 2)
                      }}</pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="collapse" @click="closeAllAPI">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="window-restore"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="24px"
          height="24px"
          class="svg-inline--fa fa-window-restore fa-w-16 fa-3x"
        >
          <path
            fill="#ffffff"
            d="M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z"
            class=""
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

function generateQuery(params) {
  return (
    "?" +
    params.reduce(
      (str, param, pIndex) =>
        (str += `${param.name}=${param.value}${
          pIndex < params.length - 1 ? "&" : ""
        }`),
      ""
    )
  );
}
function validParams(params) {
  return params.every(
    (_param) => (_param.required && _param.value) || !_param.required
  );
}

export default {
  data() {
    return {
      apis: [
        {
          baseURL: "https://my-audio1.herokuapp.com/api/",
          apis: [
            {
              id: uuidv4(),
              description: "fetch home data",
              type: "GET",
              url: "story/home",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [],
              response: null,
            },
            {
              id: uuidv4(),
              description: "search by name",
              type: "GET",
              url: "story/search",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "query",
                  type: "string",
                  description: "Query is required",
                  required: true,
                  value: "",
                  default: "Vu sư",
                },
              ],
              response: null,
            },
            {
              id: uuidv4(),
              description: "get story info by id",
              type: "GET",
              url: "story/info",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "idStory",
                  type: "Integer",
                  description: "Id of story is required",
                  required: true,
                  value: "",
                  default: 29575,
                },
              ],
              response: null,
            },
            {
              id: uuidv4(),
              description: "get chapters without pagination by story id",
              type: "GET",
              url: "story/chapter",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "storyId",
                  type: "Integer",
                  description: "Id of story is required",
                  required: true,
                  value: "",
                  default: 29575,
                },
              ],
              response: null,
            },
            {
              id: uuidv4(),
              description: "get chapters with pagination by story id",
              type: "GET",
              url: "story/chapter-with-paginate",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "storyId",
                  type: "Integer",
                  description: "Id of story is required",
                  required: true,
                  value: "",
                  default: 29575,
                },
                {
                  name: "page",
                  type: "Integer",
                  description: "page is required",
                  required: false,
                  value: "",
                  default: 0,
                },
              ],
              response: null,
            },
            {
              id: uuidv4(),
              description:
                "get content of chapter by storyUrl and chapter_url",
              type: "GET",
              url: "story/read",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "storyUrl",
                  type: "String",
                  description: "Url of story is required",
                  required: true,
                  value: "",
                  default: "tien-ma-dong-tu",
                },
                {
                  name: "chapter_url",
                  type: "String",
                  description: "Url of chapter is required",
                  required: true,
                  value: "",
                  default: "chuong-1",
                },
              ],
              response: null,
            },
            {
              id: uuidv4(),
              description: "get content of chapter by full chapter_url",
              type: "GET",
              url: "story/read-chapter-url",
              isOpen: false,
              isExecute: false,
              isExecuting: false,
              isValidated: false,
              params: [
                {
                  name: "chapter_url",
                  type: "String",
                  description: "Url of chapter is required",
                  required: true,
                  value: "",
                  default:
                    "https://truyen.tangthuvien.vn/doc-truyen/tien-ma-dong-tu/chuong-56",
                },
              ],
              response: null,
            },
          ],
        },
      ],
    };
  },
  methods: {
    executeAPI: async function (apisIndex, apiID) {
      const findApi = this.apis[apisIndex].apis.find(
        (_api) => _api.id === apiID
      );
      const baseUrl = this.apis[apisIndex].baseURL;

      if (!validParams(findApi.params)) {
        findApi.isValidated = true;
        return;
      }

      if (findApi.isExecuting) return;

      findApi.isExecuting = true;

      console.log("API: ", baseUrl, findApi, validParams(findApi.params));

      let result = await fetch(
        `${baseUrl}${findApi.url}${
          findApi.type == "GET" ? generateQuery(findApi.params) : ""
        }`,
        {
          method: findApi.type,
          headers: {
            "Content-Type": "application/json",
          },
          body: findApi.type == "POST" ? findApi.params : null,
        }
      );

      if (result) {
        result = await result.json();
      }

      findApi.response = result;
      findApi.isExecuting = false;
      console.log("Result: ", result);
    },
    executeDefaultValue: async function (apisIndex, apiID) {
      const findApi = this.apis[apisIndex].apis.find(
        (_api) => _api.id === apiID
      );
      findApi.params.forEach((param) => {
        param.value = param.default;
      });

      this.executeAPI(apisIndex, apiID);
    },
    generateRequestURL: function (apisIndex, apiID) {
      const findApi = this.apis[apisIndex].apis.find(
        (_api) => _api.id === apiID
      );
      const baseUrl = this.apis[apisIndex].baseURL;

      return `${baseUrl}${findApi.url}${
        findApi.type == "GET" ? generateQuery(findApi.params) : ""
      }`;
    },
    resetParams: function (apisIndex, apiID) {
      const findApi = this.apis[apisIndex].apis.find(
        (_api) => _api.id === apiID
      );

      findApi.params.forEach((param) => {
        param.value = "";
      });

      findApi.isExecuting = false;
      findApi.isValidated = false;
      findApi.response = null;
    },
    closeAllAPI: function () {
      this.apis.forEach((_apis) => {
        _apis.apis.forEach((api) => {
          api.response = null;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#app > div {
  margin-bottom: 46px;
}

.font-sans-serif {
  color: #3b4151;
  font-family: sans-serif;
}

.p-2 {
  padding: 6px;
}

.py-2 {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

.py-3 {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
}

.p-3 {
  padding: 9px;
}

.p-4 {
  padding: 12px;
}

.p-6 {
  padding: 18px;
}

.m-2 {
  margin: 6px;
}

.mt-1 {
  margin-top: 3px;
}
.mb-1 {
  margin-bottom: 3px;
}

.mt-2 {
  margin-top: 6px;
}

.mr-2 {
  margin-right: 6px;
}

.mt-4 {
  margin-top: 12px;
}

.mt-8 {
  margin-top: 24px;
}

.w-100 {
  width: 100%;
}

.w-94 {
  margin: auto;
  width: 94%;
}

.d-flex {
  display: flex;
  flex-wrap: nowrap;
}

.card {
  border: 1px solid #61affe;
  background: rgba(97, 175, 254, 0.1);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.19);
  border-radius: 4px;
  user-select: none;
}

.api {
  &__title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;

    &--isOpen {
      border-bottom: 1px solid #61affe;
    }
  }

  &__params {
    &--header {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &--content {
      table {
        width: 100%;
        text-align: left;
        padding: 0 16px;

        th {
          font-size: 14px;
          font-family: Open Sans, sans-serif;
          color: #3b4151;
        }

        td,
        th {
          padding: 10px 0;
        }

        &:not(.no-divide) th {
          border-bottom: 1px solid rgba(59, 65, 81, 0.2);
        }

        th:nth-child(2n),
        td:nth-child(2n) {
          width: 40%;
        }

        th:nth-child(2n + 1),
        td:nth-child(2n + 1) {
          width: 60%;
        }
      }

      .required::after {
        content: "*required";
        font-size: 10px;
        position: relative;
        top: -6px;
        padding: 5px;
        color: rgba(255, 0, 0, 0.9);
      }
    }
  }

  &__execute {
    margin: 16px 6px 20px;

    &--control {
      padding-top: 8px;
      padding-bottom: 8px;
      background: transparent;
      color: #3b4151;
      border: 2px solid gray;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      border-radius: 0 4px 4px 0;

      &.primary {
        background: #4990e2;
        color: #fff;
        border-color: #4990e2;
      }

      &.success {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745;
      }

      &:first-child {
        border-radius: 4px 0 0 4px;
      }
    }
  }

  &__response {
    &--header {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 10px 16px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &--content {
      table {
        width: 100%;
        text-align: left;

        th {
          font-size: 14px;
          font-family: Open Sans, sans-serif;
          color: #3b4151;
          border-bottom: 1px solid rgba(59, 65, 81, 0.2);
          padding: 8px 0px 16px;
        }

        td {
        }

        th:nth-child(2n),
        td:nth-child(2n) {
          width: 80%;
        }

        th:nth-child(2n + 1),
        td:nth-child(2n + 1) {
          width: 20%;
        }
      }
      pre {
        background: #41444e;
        overflow-wrap: break-word;
        font-weight: 600;
        color: #fff;
        width: 100%;
        display: block;
        white-space: pre-wrap;
      }
    }
  }
}

h4 {
  font-size: 12px;
  margin: 10px 0 0;
  font-family: Open Sans, sans-serif;
  color: #3b4151;
}

.is-btn {
  cursor: pointer;
}

.btn {
  font-size: 14px;
  font-weight: 700;
  padding: 5px 23px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  border: 2px solid gray;
  border-radius: 4px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &.btn-danger {
    border-color: #ff6060;
    color: #ff6060;
  }
  &:active,
  &:focus {
    border-color: transparent;
  }
}

.block {
  font-size: 14px;
  font-weight: 700;
  min-width: 80px;
  padding: 6px 15px;
  text-align: center;
  border-radius: 3px;
  background: #000;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  color: #fff;

  &.primary {
    background: #61affe;
  }

  &.primary {
    background: #61affe;
  }
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-uppercase {
  font-size: 14px;
  text-transform: uppercase;
}

.round-4 {
  border-radius: 4px;
}

small {
  font-size: 11px;
  font-weight: 600;
  color: #909090;
}

input {
  font-size: 15px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid;

  &.invalid {
    border-color: #f93e3e;
    background: #feebeb;
  }
}

.invalid-helper {
  font-size: 12px;
  padding: 5px;
  color: rgba(255, 0, 0, 0.9);
}

.animate__shakeY {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: shakeY;
  animation-name: shakeY;
}

@-webkit-keyframes shakeY {
  0%,
  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(0, 4px, 0);
    transform: translate3d(0, 4px, 0);
  }
}

@keyframes shakeY {
  0%,
  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(0, 4px, 0);
    transform: translate3d(0, 4px, 0);
  }
}

.collapse {
  position: fixed;
  bottom: 24px;
  left: 24px;
  padding: 16px;
  border-radius: 100%;
  background-color: #ff0000;
  transform: translateY(2px);
  transition: 0.25s;
  z-index: 100;
  box-shadow: 1px 4px 11px rgb(233 32 32 / 0.8);
  cursor: pointer;

  &:active {
    transform: translateY(2px);
  }
}
</style>
