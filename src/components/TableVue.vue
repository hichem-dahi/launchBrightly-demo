<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import baremetricsRequests from '@/api/api'
import type { IBaremetrics, IItemFeature, IScreenshot } from "@/models/models";
import dayjs from 'dayjs'

enum sortDirection {
  ASC = 1,
  DES
}

enum featuresFields {
  Id = 'id',
  Name = 'name',
  Description = 'description',
  Screenshots = 'screenshots',
  TimeOfCapture = 'timeOfCapture'
}

const baremetricsData = ref<IBaremetrics | null>(null)
const features = ref<IItemFeature[] | null>(null)
const sort = ref<{field: featuresFields | null, direction: sortDirection| null}>({field: null, direction: null})
const editionFilters = ref<string[]>([])
const selectedFilter = ref('')


const sortableFeatures = computed(()=> {
  if(filterableFeatures.value){
    let tmpSortableFeatures: IItemFeature[] = [...filterableFeatures.value]
    if(sort.value.field){
      switch (sort.value.field) {
        case 'name':
        case 'id':
        case 'description':
          //FOR alphabetical order
          tmpSortableFeatures = [...filterableFeatures.value].sort((a, b) => { 
              if((a[sort.value.field as keyof IItemFeature]! as string).toLowerCase() > (b[sort.value.field as keyof IItemFeature]! as string).toLowerCase()){
                return 1
              } else if((a[sort.value.field as keyof IItemFeature] as string).toLowerCase() < (b[sort.value.field as keyof IItemFeature] as string).toLowerCase()) {
                return -1
              } else { return 0 }
          })
          break;
        case 'screenshots':
          tmpSortableFeatures = [...filterableFeatures.value].sort((a,b)=> a.screenshots.items.length - b.screenshots.items.length)
          break;
        case 'timeOfCapture':
          tmpSortableFeatures = sortAccordingToLatestDates()
          break;
        default:
          return null
      }
      if(sort.value.direction) {      
        return sort.value.direction === sortDirection.DES ? tmpSortableFeatures.reverse() : tmpSortableFeatures
      } else { return tmpSortableFeatures}
    } else {
      return tmpSortableFeatures
    }
  } else { return null }
  
})

const filterableFeatures = computed(()=>{
    if(selectedFilter.value) {
      return features.value?.filter(item => {
        return item.FeatureEditions.items
        .map(item => item.edition.name)
        .some(element => element.includes(selectedFilter.value));
      })
    } else { return features.value}   
})

function setSort(field: featuresFields) {
  if(!sort.value.field || sort.value.field !== field) {
    //IF no header is already picked or a different header is picked 
    sort.value.field = field
    sort.value.direction = sortDirection.ASC 
  } else if(sort.value.field === field){
    //To switch the order of sorting or disapply the sorting
    sort.value.direction = sort.value.direction === sortDirection.ASC ? sortDirection.DES : null
    if(!sort.value.direction){
      sort.value.field = null
    }
  }
}
//SORT screenshots according to their dates
function sortAccordingToDates(items: IScreenshot[]) {  
  return [...items].sort((a,b)=>{
    if(dayjs(a.timeOfCapture).isAfter(b.timeOfCapture) || (a.timeOfCapture && !b.timeOfCapture)){ return -1 
    } else if(dayjs(a.timeOfCapture).isBefore(b.timeOfCapture) || (!a.timeOfCapture && b.timeOfCapture)){ return 1 }
    else { return 0 }
  })
}

//SORT features according to their latest screenshot's date
function sortAccordingToLatestDates() {
  const tmpSortableFeatures = [...filterableFeatures.value as IItemFeature[]]
  let latestScreenshots: IScreenshot[] = []
  if(filterableFeatures.value){
    for (const index in filterableFeatures.value) {
      latestScreenshots = [...latestScreenshots, sortAccordingToDates(filterableFeatures.value[index].screenshots.items)[0]]
    }
  }

  return tmpSortableFeatures.sort((a,b)=>{
    //Compare only the latest dates
    const LatestDateA = dayjs(a.screenshots.items.find(item => latestScreenshots.map(item => item.timeOfCapture).includes(item.timeOfCapture))!.timeOfCapture)
    const LatestDateB = dayjs(b.screenshots.items.find(item => latestScreenshots.map(item => item.timeOfCapture).includes(item.timeOfCapture))!.timeOfCapture)
    if(LatestDateA.isAfter(LatestDateB)) { 
      return 1 
    } else if(LatestDateA.isBefore(LatestDateB)) { 
      return -1 
    } else { 
      return 0 
    }
  })
}


 onMounted(async() => {
  try {
    baremetricsData.value = await baremetricsRequests.getBaremetrics()
  } catch(e) {
    console.error(e)  
    return
  }
  features.value = baremetricsData.value.features.items 
  //GET unique editions names to filter with
  const editionItems = features.value.map(item => item.FeatureEditions.items)
  const editionNames =([] as string[]).concat(...editionItems.map(item => item.map(item => item.edition.name)));
  const uniqueNames = new Set(editionNames)
  editionFilters.value = [...uniqueNames]
})

</script>

<template>
  <div>
    <div class="text-2xl mb-12 ml-4">Liste of features</div>
    <div class="flex flex-row items-start">
      <table class="border border-purple-500 bg-purple-50">
        <thead>
          <tr>
            <th @click="setSort(featuresFields.Id)" class="headers">
              <div class="flex">
                <div>Id</div> 
                <span v-if="sort.field === featuresFields.Id" class="material-symbols-outlined">
                {{ sort.direction === sortDirection.ASC ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </span>
              </div>
            </th>
            <th @click="setSort(featuresFields.Name)" class="headers">
              <div class="flex">
                <div>Name</div> 
                <span v-if="sort.field === featuresFields.Name"  class="material-symbols-outlined">
                {{ sort.direction === sortDirection.ASC ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </span>
              </div>
            </th>
            <th @click="setSort(featuresFields.Description)" class="headers">
              <div class="flex">
                <div>Description</div>
                <span v-if="sort.field === featuresFields.Description" class="material-symbols-outlined">
                {{ sort.direction === sortDirection.ASC ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </span>
            </div>
            </th>
            <th @click="setSort(featuresFields.Screenshots)" class="headers">
              <div class="flex">
                <div>Number of screenshots</div>
                <span v-if="sort.field === featuresFields.Screenshots" class="material-symbols-outlined">
                {{ sort.direction === sortDirection.ASC ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </span>
            </div>
            </th>
            <th @click="setSort(featuresFields.TimeOfCapture)" class="headers">
              <div class="flex">
                <div>Latest capture</div>
                <span v-if="sort.field === featuresFields.TimeOfCapture" class="material-symbols-outlined">
                {{ sort.direction === sortDirection.ASC ? 'arrow_drop_down' : 'arrow_drop_up'}}
                </span>
              </div>
            </th>
            <th class="border border-purple-500">
              <div>Editions</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feature in sortableFeatures" :key="feature.id">
            <td class="border border-slate-300 text-center p-3">{{ feature.id }}</td> 
            <td class="border border-slate-300 text-center p-3">{{ feature.name }}</td> 
            <td class="border border-slate-300 text-center p-3">{{ feature.description }}</td> 
            <td class="border border-slate-300 text-center p-3">{{ feature.screenshots.items.length }}</td> 
            <td class="border border-slate-300 text-center p-3">{{ sortAccordingToDates(feature.screenshots.items)[0].timeOfCapture}}</td> 
            <td class="border border-slate-300 text-center p-3">{{ feature.FeatureEditions.items.map(item => item.edition.name).join(', ')}}</td> 
          </tr>
        </tbody>
      </table>
      <div class="ml-6">
        <div>
          <label class="font-bold" for="edition">Filter editions</label>
          <div class="flex items-center">
            <select class="border border-purple-500 my-3" v-model="selectedFilter" name="edition">
              <option v-for="(editionFilter,i) in editionFilters" :key="i" :value="editionFilter">{{ editionFilter }}</option>
            </select>
            <button class="flex items-center mx-3" @click="selectedFilter = ''">
              <span class="material-symbols-outlined text-[1.25rem]">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.headers {
  white-space: nowrap;
  padding: 1rem;
  border-width: 1px;
  border-color: #8c17da;
}
</style>
