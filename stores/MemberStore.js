import { useCookie } from "#app";

export const MemberStore = defineStore("member", {
  state: () => ({
    tree_id: "",
    full_name: "",
    gender: "",
    job: "",
    date: "",
    image: "",
    married: false,
    being_child: false,
    place_of_birth: "",
    date_of_birth: "",
    description: "",
    address: "",
    relationship: "",
    alive: true,
    death_id: "",
    achivements: [],
  }),
  actions: {
    async getMember(member_id) {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/member/get`,
          {
            method: "POST",
            body: JSON.stringify({ member_id }),
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.tree_id = data.value?.member.tree_id;
          this.full_name = data.value?.member.full_name;
          this.gender = data.value?.member.gender;
          this.job = data.value?.member.job;
          this.date = data.value?.member.date;
          this.married = data.value?.member.married;
          this.being_child = data.value?.member.being_child;
          this.image = data.value?.member.image;
          this.place_of_birth = data.value?.member.place_of_birth;
          this.date_of_birth = data.value?.member.date_of_birth;
          this.description = data.value?.member.description;
          this.address = data.value?.member.address;
          this.relationship = data.value?.member.relationship;
          this.alive = data.value?.member.alive ?? true;
          this.death_id = data.value?.member.death_id;
          this.achievements = data.value?.member.achievements ?? [];
        } else {
          alert("Có lỗi trong lúc lấy Member Info. Thử lại sau");
          navigateTo("/");
        }
      } catch (err) {
        console.error("Fetch Member Info thất bại:", err);
        alert("Có lỗi trong lúc lấy Member Info. Thử lại sau");
        navigateTo("/");
      }
    },
    async addCoupleRelationship(member_id, partner_id, children) {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/relationship/addcouples`,
          {
            method: "POST",
            body: JSON.stringify({ member_id, partner_id, children }),
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          await this.getMember(member_id);
        } else {
          alert("Có lỗi trong lúc Add Relationship. Thử lại sau");
          navigateTo(`/member/${member_id}`);
        }
      } catch (err) {
        console.error("Add Relationship thất bại:", err);
        alert("Có lỗi trong lúc Add Relationship. Thử lại sau");
        navigateTo(`/member/${member_id}`);
      }
    },
    async getUnmarried() {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/member/getunmarried`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          return data.value?.members;
        } else {
          return [];
        }
      } catch (err) {
        console.error("Get Unmarried thất bại:", err);
        alert("Có lỗi trong lúc Get Unmarried. Thử lại sau");
        return [];
      }
    },
    async getUnparents() {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/member/getunparents`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken.value,
            },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          return data.value?.members;
        } else {
          return [];
        }
      } catch (err) {
        console.error("Get Unparents thất bại:", err);
        alert("Có lỗi trong lúc Get Unparents. Thử lại sau");
        return [];
      }
    },
    async getRelationship(member_id) {
      try {
        const config = useRuntimeConfig();
        const authToken = useCookie("auth-token");
        const { data, error } = await useFetch(
          `${config.public.apiBase}/api/relationship/get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              body: JSON.stringify({ member_id }),
              "auth-token": authToken.value,
            },
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          return data.value?.relationship;
        } else {
          return {};
        }
      } catch (err) {
        console.error("Get Unmarried thất bại:", err);
        alert("Có lỗi trong lúc Get Unmarried. Thử lại sau");
        return {};
      }
    },
  },
});
