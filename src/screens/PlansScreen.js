import React, { useState, useEffect} from 'react'
import db from '../firebase-config'
import './PlansScreen.css'
import { query, collection, getDocs, where, doc, addDoc, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { loadStripe } from '@stripe/stripe-js'

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser); 
  const [subscription, setSubscription] = useState(null)
  useEffect (() => {
    const subref =  collection(db, `customers/${user.uid}/subscriptions`)
    let qu = query(subref);
    getDocs(qu).then((querySnapshot) => {
      querySnapshot.forEach(async (subscription) => {
        setSubscription({
          role : subscription.data().role,
          current_period_end : subscription.data().current_period_end.seconds,
          current_period_start : subscription.data().current_period_start.seconds,
        });
      })
    })

  }, [user.uid]);

  useEffect(() => {
    
      let productsCollRef = collection(db, "products");
      let q = query(productsCollRef, where("active", "==", true));
      getDocs(q).then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach( async (productDoc) => {
          products[productDoc.id] = productDoc.data();
  
          let pricesCollRef = collection(productDoc.ref, "prices");
          const pricesSnap = await getDocs(pricesCollRef);
  
  
          pricesSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
          };
          });
  
        });
        setProducts(products);
      });
   }, []);
   console.log(products)
   console.log(subscription)

   const loadCheckout = async (priceId) =>{
    const docRef = await addDoc(collection(db, `customers/${user.uid}/checkout_sessions`), {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    onSnapshot(docRef, async (snap) => {
    const { error, sessionId } = snap.data();
        if (error) {
          // Show an error to your customer and
          // inspect your Cloud Function logs in the Firebase console.
          alert(`An error occured: ${error.message}`);
        }
        if (sessionId) {
          // We have a Stripe Checkout URL, let's redirect.
            const stripe = await loadStripe("pk_test_51MFdpFSBe0xDfKbBcEydv9Soj1qi6Bj0TyVSfW2P4DoFP3Qx3COF1dmkg3RVV3A48kgKrkvFjG3OQt14WcJze5Ag00hPKd6xdI");
            stripe.redirectToCheckout({sessionId});
            // stripe.location.assign({sessionId});
          };
        
    })
   }
   
  return (
    <div className='plansScreen'>
      <br />
      {subscription && <p>Renewal Date: {new Date(subscription.current_period_end*1000).toLocaleDateString()}</p>}
      {Object.entries(products).map(([productId, productData]) => {
          const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);
          
          return (
            <div key={productId} className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`}>
              <div className="plansScreen__info">
                <h5>{productData.name}</h5>
                <h6>{productData.description}</h6>
              </div>
              <button onClick={() => !isCurrentPackage && loadCheckout(productData?.prices.priceId)}>{isCurrentPackage ? 'Current Package' : 'Subscribe'}</button>
            </div>
          ) 
      })}
    </div>
  )
}

export default PlansScreen