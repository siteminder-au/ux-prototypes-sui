<script setup lang="ts">
import { reactive } from 'vue'
import { RoomType } from './room-list-data'

withDefaults(defineProps<{
  roomTypes: RoomType[]
}>(), {
  roomTypes: () => [],
})

const form = reactive({
  search: null,
})

const clearForm = (): void => {
  form.search = null
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <sm-form
          @reset="clearForm"
        >
          <sm-input
            id="filter-by-name"
            v-model="form.search"
            label="Search"
            type="search"
            name="search"
          />
          <sm-button
            type="text"
            native-type="reset"
          >
            Clear
          </sm-button>
        </sm-form>
      </div>

      <div class="flex-1 self-center text-right">
        <sm-button type="text">
          <sm-icon name="action-pin" />
          Action 1
        </sm-button>
        <sm-button type="text">
          <sm-icon name="action-filter" />Action 2
        </sm-button>
      </div>
    </div>

    <ul class="room-type-list sm-list--no-style">
      <li
        v-for="roomType in roomTypes"
        :key="roomType.id"
        class="mb-24"
      >
        <div class="flex">
          <div class="flex-grow list-info p-24 truncate">
            <span class="inline-block mb-8 sm-h5">{{ roomType.name }}</span>
            <p class="mb-8 truncate">
              {{ roomType.description }}
            </p>
            <div class="flex flex-wrap">
              <div
                v-for="amenity in roomType.amenities"
                :key="amenity.id"
                class="pb-8 pr-8 truncate w-1/4"
              >
                <sm-icon
                  class="mr-8"
                  name="amenity-bathroom"
                />{{ amenity.name }}
              </div>
            </div>
          </div>
          <div
            class="flex justify-end list-image p-8"
            :style="{ backgroundImage: 'url(' + roomType.imageUrl + ')' }"
          >
            <div>
              <sm-button
                shape="square"
                type="tertiary"
                size="large"
                :aria-label="'Edit Room ' + roomType.name"
              >
                <sm-icon name="action-context-menu" />
              </sm-button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

.sm-list--no-style {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-type-list {
  .list-info {
    border: 1px solid $blue-neu-mid;
    border-right: none;
    border-radius: 4px 0 0 4px;
  }

  .list-image {
    min-width: 248px;
    min-height: 160px;
    border-radius: 0 4px 4px 0;
    background-color: $blue-neu-mid;
  }
}
</style>
