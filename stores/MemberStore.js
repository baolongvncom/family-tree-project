export const MemberStore = defineStore("member", {
  state: () => ({
    member_id: "",
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
    couples_relationship: "",
    parents_relationship: "",
    alive: true,
    death_id: "",
    achievements: [],

    husband: { _id: "", full_name: "None" },
    wife: { _id: "", full_name: "None" },
    children: [],
    father: { _id: "", full_name: "None" },
    mother: { _id: "", full_name: "None" },
    date_of_marriage: null,

    permission: "",
    jobs: [],
    hometowns: [],
  }),
  actions: {
    async getMember(member_id) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/member/get`, {
          method: "POST",
          body: JSON.stringify({ member_id }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          this.member_id = member_id;
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
          this.couples_relationship = data.value?.member.couples_relationship;
          this.parents_relationship = data.value?.member.parents_relationship;
          this.alive = data.value?.member.alive ?? true;
          this.death_id = data.value?.member.death_id;
          this.achievements = data.value?.member.achievements ?? [];
          this.permission = data.value?.permission;
          this.jobs = data.value?.jobs;
          this.hometowns = data.value?.hometowns;
        } else {
          // alert("Có lỗi trong lúc lấy Member Info. Thử lại sau");
          navigateTo("/");
        }
      } catch (err) {
        console.error("Fetch Member Info thất bại:", err);
        // alert(`Có lỗi trong lúc lấy Member Info. Thử lại sau ${err}`);
        navigateTo("/");
      }
    },
    async addCoupleRelationship(partner_id, children, date_of_marriage) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/relationship/addcouples`,
          {
            method: "POST",
            body: JSON.stringify({
              member_id: this.member_id,
              partner_id,
              children,
              date_of_marriage,
            }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          // await Promise.all([this.getCouplesRelationship()]);
          alert("Add Couples Relationship thành công");
        } else {
          alert("Có lỗi trong lúc Add Relationship. Thử lại sau");
          navigateTo(`/member/${this.member_id}`);
        }
      } catch (err) {
        console.error("Add Relationship thất bại:", err);
        alert("Có lỗi trong lúc Add Relationship. Thử lại sau");
        navigateTo(`/member/${this.member_id}`);
      }
    },
    async getUnmarried() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/member/getunmarried`, {
          method: "GET",
        });

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
        // alert("Có lỗi trong lúc Get Unmarried. Thử lại sau");
        return [];
      }
    },
    async getCouples() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/member/getcouples`, {
          method: "GET",
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          return data.value?.relationships;
        } else {
          return [];
        }
      } catch (err) {
        console.error("Get Unmarried thất bại:", err);
        // alert("Có lỗi trong lúc Get Couples. Thử lại sau");
        return [];
      }
    },
    async getUnparents() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/member/getunparents`, {
          method: "POST",
          body: JSON.stringify({
            member_id: this.member_id,
            tree_id: this.tree_id,
          }),
        });

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
        // alert("Có lỗi trong lúc Get Unparents. Thử lại sau");
        return [];
      }
    },
    async addParentsRelationship(relationship_id) {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/relationship/addparents`,
          {
            method: "POST",
            body: JSON.stringify({
              member_id: this.member_id,
              relationship_id,
            }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          // await Promise.all([this.getParentsRelationship()]);
          alert("Add Parents Relationship thành công");
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Add Parents Relationship thất bại:", err);
        alert("Có lỗi trong lúc Add Parents Relationship. Thử lại sau");
        return {};
      }
    },
    async getParentsRelationship() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/parents_relationship/get`,
          {
            method: "POST",
            body: JSON.stringify({ member_id: this.member_id }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          if (
            data.value.relationship &&
            data.value.relationship.type == "couples"
          ) {
            this.mother = data.value.relationship.data.wife;
            this.father = data.value.relationship.data.husband;
            this.parents_relationship = data.value.relationship._id;
          } else {
            this.mother = { _id: "", full_name: "None" };
            this.father = { _id: "", full_name: "None" };
            this.parents_relationship = data.value.relationship._id;
          }
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Get Parents Relationship thất bại:", err);
        // alert("Có lỗi trong lúc Get Parents Relationship. Thử lại sau");
      }
    },
    async getCouplesRelationship() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/couples_relationship/get`,
          {
            method: "POST",
            body: JSON.stringify({ member_id: this.member_id }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          if (
            data.value.relationship &&
            data.value.relationship.type == "couples"
          ) {
            this.husband = data.value.relationship.data.husband;
            this.wife = data.value.relationship.data.wife;
            this.children = data.value.relationship.data.children;
            this.couples_relationship = data.value.relationship._id;
            this.date_of_marriage = data.value.relationship.data.date_of_marriage;
          } else {
            this.husband = { _id: "", full_name: "None" };
            this.wife = { _id: "", full_name: "None" };
            this.children = [];
            this.couples_relationship = data.value.relationship._id;
            this.date_of_marriage = null;
          }
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Get Couples Relationship thất bại:", err);
        // alert("Có lỗi trong lúc Get Couples Relationship. Thử lại sau");
      }
    },

    async deleteCouplesRelationship() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/relationship/deletecouples`,
          {
            method: "POST",
            body: JSON.stringify({ member_id: this.member_id }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          // await this.getCouplesRelationship();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Delete Relationship thất bại:", err);
        // alert("Có lỗi trong lúc Delete Relationship. Thử lại sau");
      }
    },

    async deleteParentsRelationship() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(
          `/api/relationship/deleteparents`,
          {
            method: "POST",
            body: JSON.stringify({ member_id: this.member_id }),
          }
        );

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          // await this.getParentsRelationship();
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Delete Parents Relationship thất bại:", err);
        // alert("Có lỗi trong lúc Delete Parents Relationship. Thử lại sau");
      }
    },
    async deleteMember() {
      try {
        const { useFetchApi } = useApi();
        const { data, error } = await useFetchApi(`/api/member/delete`, {
          method: "POST",
          body: JSON.stringify({ member_id: this.member_id }),
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        if (data.value?.success) {
          navigateTo(`/family/${this.tree_id}`);
        } else {
          throw new Error(data.value?.message);
        }
      } catch (err) {
        console.error("Delete Member thất bại:", err);
        alert("Có lỗi trong lúc Delete Member. Thử lại sau");
      }
    },
  },
  persist: true,
});
