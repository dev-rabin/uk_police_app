import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ReportDetails = ({ route,navigation }) => {
  const { complaintId } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
          <Text style={styles.detailTitle}>Complaint ID: {complaintId}</Text>
          <Text style={{fontWeight:"bold", marginHorizontal:8}}>Added On : 24 January,2025</Text>
        <View style={styles.detail}>
          <Text style={styles.detailContent}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis reiciendis placeat nisi dolor culpa obcaecati voluptatem nesciunt optio, est magnam excepturi ea vero necessitatibus nobis saepe non adipisci consequatur deleniti doloribus earum tenetur dolore. Culpa hic corrupti, modi nulla excepturi provident, numquam natus error optio doloribus quia, possimus architecto sint magni facere eius. Consequuntur neque cum ipsam consequatur minus magni aspernatur veniam laudantium id, dicta numquam facilis corporis perspiciatis ipsa labore repudiandae aperiam commodi est maxime velit nesciunt reprehenderit culpa quisquam mollitia? Quia repellendus tempora expedita fugit qui laudantium est reiciendis, consequuntur placeat nemo tenetur! Alias incidunt, itaque, libero pariatur odio nulla nostrum minus nesciunt omnis explicabo qui. Ut consequatur esse eos eveniet, similique laborum obcaecati maxime assumenda tempore blanditiis molestiae deleniti accusantium quas sequi beatae soluta possimus, tenetur sapiente praesentium architecto nobis sunt dolorum reiciendis ullam. Cupiditate odio perspiciatis quasi enim recusandae laudantium, asperiores vel, mollitia inventore atque, esse optio. Architecto tenetur, quod totam quis, quaerat minima nobis ipsam quae accusamus rem sit deserunt similique atque molestias doloremque, eos eveniet eum blanditiis quos nisi. Sed modi voluptates corporis placeat quas iusto, eligendi consectetur Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque eos magnam voluptates dolor neque! Error sint ipsa deserunt, a provident laborum ut, voluptas laudantium animi pariatur quidem non nobis quae. Expedita, tempore quasi! Odit numquam, quas voluptatibus cupiditate molestias deserunt cum natus quo itaque velit similique omnis perspiciatis inventore architecto explicabo facilis culpa voluptatum voluptatem atque saepe illum, asperiores nostrum vero optio. Libero ipsum ratione, dolorem reiciendis officiis corporis ad assumenda non maiores ut maxime a possimus? Perspiciatis ipsam tenetur doloribus ea est, nulla suscipit praesentium quisquam dignissimos cupiditate odit laudantium rerum repellat iusto numquam blanditiis sequi quia ullam quaerat sint debitis ducimus rem? Assumenda accusantium possimus earum, ipsum quo autem nobis, est debitis doloribus optio culpa alias. Aspernatur dolorum veniam laborum perferendis possimus molestiae a cum facilis, sunt quis maxime eos dicta excepturi iure nesciunt assumenda maiores placeat quos illo aliquam tenetur quidem mollitia unde reiciendis. Harum dolor dolores minus molestias libero assumenda, aspernatur fugiat nobis fugit praesentium aperiam similique consectetur eius commodi! Nemo voluptate et ex corporis? Minima harum minus qui quidem cumque id, quos voluptate delectus vitae. Perferendis reprehenderit quae similique quas ex quam amet repudiandae optio, maiores velit repellat voluptates facilis molestiae possimus aliquid, architecto dolore mollitia ipsum deleniti natus vero tempora dolorem dolores unde. Unde earum voluptate ea facere illum rerum et, expedita voluptatibus, veritatis mollitia magnam consequatur quidem, quae fugiat doloribus nostrum eum aspernatur doloremque beatae? Eos ullam alias ex temporibus quis odit dolores qui vitae sint nam adipisci quod nostrum earum quae accusamus nesciunt, libero similique quisquam magni delectus, sequi eveniet. Ullam, modi non quia, quisquam, consectetur quae omnis nulla praesentium doloribus hic sit. Repellat, nemo quo recusandae commodi ea illo, tempore debitis omnis corporis culpa eaque nostrum ducimus quasi 
          </Text>
        </View>

        <Text style={{fontWeight:"bold", marginHorizontal:8}}>Updated On : 24 January,2025</Text>
        <View style={styles.detail}>
          <Text style={styles.detailContent}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis reiciendis placeat nisi dolor culpa obcaecati voluptatem nesciunt optio, est magnam excepturi ea vero necessitatibus nobis saepe non adipisci consequatur deleniti doloribus earum tenetur dolore. Culpa hic corrupti, modi nulla excepturi provident, numquam natus error optio doloribus quia, possimus architecto sint magni facere eius. Consequuntur neque cum ipsam consequatur minus magni aspernatur veniam laudantium id, dicta numquam facilis corporis perspiciatis ipsa labore repudiandae aperiam commodi est maxime velit nesciunt reprehenderit culpa quisquam mollitia? Quia repellendus tempora expedita fugit qui laudantium est reiciendis, consequuntur placeat nemo tenetur! Alias incidunt, itaque, libero pariatur odio nulla nostrum minus nesciunt omnis explicabo qui. Ut consequatur esse eos eveniet, similique laborum obcaecati maxime assumenda tempore blanditiis molestiae deleniti accusantium quas sequi beatae soluta possimus, tenetur sapiente praesentium architecto nobis sunt dolorum reiciendis ullam. Cupiditate odio perspiciatis quasi enim recusandae laudantium, asperiores vel, mollitia inventore atque, esse optio. Architecto tenetur, quod totam quis, quaerat minima nobis ipsam quae accusamus rem sit deserunt similique atque molestias doloremque, eos eveniet eum blanditiis quos nisi. Sed modi voluptates corporis placeat quas iusto, eligendi consectetur Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque eos magnam voluptates dolor neque! 
          </Text>
        </View>

        <Text style={{fontWeight:"bold", marginHorizontal:8}}>Updated On : 24 January,2025</Text>
        <View style={styles.detail}>
          <Text style={styles.detailContent}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis reiciendis placeat nisi dolor culpa obcaecati voluptatem nesciunt optio, est magnam excepturi ea vero necessitatibus nobis saepe non adipisci consequatur deleniti doloribus earum tenetur dolore. Culpa hic corrupti, modi nulla excepturi provident, numquam natus error optio doloribus quia, possimus architecto sint magni facere eius. Consequuntur neque cum ipsam consequatur minus magni aspernatur veniam laudantium id, dicta numquam facilis corporis perspiciatis ipsa labore repudiandae aperiam commodi est maxime velit nesciunt reprehenderit culpa quisquam mollitia? Quia repellendus tempora expedita fugit qui laudantium est reiciendis, consequuntur placeat nemo tenetur! Alias incidunt, itaque, libero pariatur odio nulla nostrum minus nesciunt omnis explicabo qui. Ut consequatur esse eos eveniet, similique laborum obcaecati maxime assumenda tempore blanditiis molestiae deleniti accusantium quas sequi beatae soluta possimus, tenetur sapiente praesentium architecto nobis sunt dolorum reiciendis ullam. Cupiditate odio perspiciatis quasi enim recusandae laudantium, asperiores vel, 
          </Text>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton}
      onPress={()=>navigation.navigate("Add More")}
      >
        <Text style={styles.buttonText}>Add More Detail</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollView: { flex: 1, padding: 15 },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  detail: { padding: 8, backgroundColor: '#F9F9F9', borderRadius: 10, marginVertical: 10 },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 , textAlign : "center"},
  detailContent: { fontSize: 14, textAlign: 'justify' },

  // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Add shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius : 10,
    paddingHorizontal:10,
    paddingVertical : 13
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight:"bold"
  },
});

export default ReportDetails;
